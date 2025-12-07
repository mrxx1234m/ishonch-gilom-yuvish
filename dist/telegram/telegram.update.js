"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramUpdate = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const google_sheets_service_1 = require("../google-sheets/google-sheets.service");
const prisma_service_1 = require("../prisma/prisma.service");
const telegraf_1 = require("telegraf");
const telegraf_2 = require("telegraf");
let TelegramUpdate = class TelegramUpdate {
    prisma;
    bot;
    googleSheets;
    constructor(prisma, bot, googleSheets) {
        this.prisma = prisma;
        this.bot = bot;
        this.googleSheets = googleSheets;
    }
    async notifyUser(order) {
        if (!order?.user?.telegramId)
            return;
        const total = order.items?.reduce((sum, i) => sum + i.price, 0);
        let message = '';
        switch (order.status) {
            case 'PENDING':
                message = `📦 Buyurtmangiz qabul qilindi!\nBuyurma id: ${order.id}`;
                break;
            case 'PROCESSING':
                message = `🛠 Buyurtmangiz ishlanmoqda!\nBuyurma id: ${order.id}\nUmumiy summa: ${total?.toLocaleString()} so‘m`;
                break;
            case 'DONE':
                message = `✅ Buyurtmangiz bajarildi!\nBuyurma id: ${order.id}\nUmumiy summa: ${total?.toLocaleString()} so‘m\nRahmat!`;
                break;
            case 'CANCELLED':
                message = `❌ Buyurtmangiz bekor qilindi.\nBuyurma id: ${order.id}`;
                break;
            default:
                message = `ℹ️ Buyurtma holati yangilandi.\nBuyurma id: ${order.id}`;
        }
        try {
            await this.bot.telegram.sendMessage(order.user.telegramId, message);
        }
        catch (err) {
            console.error('Telegram xabar yuborilmadi:', err);
        }
    }
    async start(ctx) {
        await ctx.reply(` Assalomu alaykum, hurmatli mijoz! 🙂

Sizni bizning xizmat botimizda ko‘rib turganimizdan xursandmiz.

Xizmatlar bilan tanishish yoki buyurtma berish uchun  menyudan foydalaning 👇
`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Xizmat turlari va narxlari', callback_data: 'prices' }],
                    [{ text: 'Buyurtma berish', callback_data: 'order' }],
                    [{ text: 'Buyurtmalarim', callback_data: 'my_orders' }],
                    [
                        {
                            text: 'Operator bilan aloqa',
                            callback_data: 'contact_operator',
                        },
                    ],
                    [{ text: 'Biz haqimizda', callback_data: 'about' }],
                ],
            },
        });
    }
    async handleContactOperator(ctx) {
        await ctx.answerCbQuery();
        await ctx.reply(`
      📞 Bizning qo‘llab-quvvatlash markazi sizga yordam berishga tayyor!

Agar savollaringiz bo‘lsa yoki buyurtma bo‘yicha qo‘shimcha ma’lumot kerak bo‘lsa, quyidagi raqam orqali operatorimiz bilan bog‘lanishingiz mumkin:

📱 +998732003636

⏱ Ish vaqti: 09:00 — 21:00 (har kuni)

Operatorlarimiz sizning murojaatingizni imkon qadar tezda ko‘rib chiqadi va yordam beradi. 🙂
`);
    }
    async handleMyOrders(ctx) {
        await ctx.answerCbQuery();
        const telegramId = String(ctx.from.id);
        const user = await this.prisma.user.findUnique({
            where: { telegramId },
        });
        if (!user) {
            return await ctx.reply('❗️ Sizda hali buyurtmalar mavjud emas.');
        }
        const orders = await this.prisma.order.findMany({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        tariff: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!orders.length) {
            return await ctx.reply('❗️ Sizda hali buyurtmalar mavjud emas.');
        }
        for (const order of orders) {
            const total = order.items.reduce((sum, i) => sum + i.price, 0);
            let itemsText = '';
            for (const item of order.items) {
                itemsText +=
                    `• ${item.tariff.serviceName}` +
                        ` — ${item.price.toLocaleString()} so‘m\n`;
            }
            const msg = `🆔 *Buyurtma ID:* ${order.id}\n` +
                `📅 Sana: ${order.createdAt.toLocaleString('uz-UZ')}\n` +
                `📌 Status: *${order.status}*\n\n` +
                `🧾 Xizmatlar:\n${itemsText}\n` +
                `💰 *Jami:* ${total.toLocaleString()} so‘m\n`;
            await ctx.reply(msg, { parse_mode: 'Markdown' });
        }
    }
    async handlePrices(ctx) {
        await ctx.answerCbQuery();
        const regions = await this.prisma.regions.findMany();
        if (regions.length === 0) {
            await ctx.reply('Hozircha hududlar mavjud emas.');
            return;
        }
        const buttons = regions.map((region) => [
            { text: region.name, callback_data: `prices_region_${region.id}` },
        ]);
        await ctx.reply('Iltimos, hududni tanlang! 👇🏻', {
            reply_markup: {
                inline_keyboard: buttons,
            },
        });
    }
    async handleAbout(ctx) {
        await ctx.answerCbQuery();
        await ctx.reply(`
              “Ishonch”


“Ishonch” gilam yuvish korxonasi 2017-yil 4-dekabrda Alimov Muxiddin tomonidan avtoyuvish shoxobchasi sifatida ochilgan bo‘lib, keyinchalik faoliyatini gilam yuvishga o‘zgartirgan.
2017 yilda 3 kishidan iborat jamoa 120 dan ortiq xodimlarga ega bo'lgan ahil jamoaga aylandi. Bu yo‘nalishda 400 dan ortiq talabalarimiz bor. Bugungi kunda O‘zbekistonning 10 ta shahar va viloyatida filiallarimiz faoliyat ko‘rsatmoqda. Hammasi bo'lib 1 million kvadrat metrdan ortiq gilam yuvildi, bu taxminan 100 ming donadan ortiq.
Nega bizni tanlashadi?



✅  Sifat kafolati

✅  Toza va xavfsiz tozalash

✅  Tajriba va ishonch

✅  Bepul olib ketish va yetkazib berish
`);
    }
    async handleRegionPrices(ctx) {
        await ctx.answerCbQuery();
        if (!ctx.callbackQuery || !('data' in ctx.callbackQuery))
            return;
        const regionId = Number(ctx.callbackQuery.data.split('_')[2]);
        ctx.session = ctx.session || {};
        ctx.session.prices = { regionId };
        const categoryButtons = Object.values(client_1.Services).map((c) => [
            { text: c, callback_data: `prices_category_${c}` },
        ]);
        await ctx.reply('Qaysi xizmat turi bilan tanishmoqchisiz?', {
            reply_markup: { inline_keyboard: categoryButtons },
        });
    }
    async handlePricesCategory(ctx) {
        await ctx.answerCbQuery();
        if (!ctx.callbackQuery || !('data' in ctx.callbackQuery))
            return;
        const category = ctx.callbackQuery.data.replace('prices_category_', '');
        const { regionId } = ctx.session.prices;
        const tariffRegions = await this.prisma.tariffRegion.findMany({
            where: {
                regionId,
                tariff: { category, isActive: true },
            },
            include: { tariff: true },
        });
        if (!tariffRegions.length) {
            return await ctx.reply('Bu hudud va category uchun tariflar topilmadi.');
        }
        for (const tr of tariffRegions) {
            let msg = `📌 *${tr.tariff.serviceName}*\n`;
            msg += `🔰 Category: ${tr.tariff.category}\n`;
            msg += `💵 Narx: *${tr.pricePerM2} so‘m/m²*\n`;
            if (tr.tariff.description)
                msg += `📝 ${tr.tariff.description}`;
            await ctx.reply(msg, { parse_mode: 'Markdown' });
        }
    }
    async handleOrder(ctx) {
        ctx.session = ctx.session || {};
        ctx.session.order = {};
        ctx.session.order.step = 'awaiting_region';
        const regions = await this.prisma.regions.findMany({
            orderBy: { name: 'asc' },
        });
        if (!regions.length) {
            return await ctx.reply('❗️ Hozircha hududlar mavjud emas. Admin bilan bog‘laning.');
        }
        const buttons = regions.map((r) => [
            { text: r.name, callback_data: `region_${r.id}` },
        ]);
        await ctx.reply(`Mebelingiz o‘rindiqlar soni bo‘yicha yuviladi. Buyurtma berayotganda nechta o‘rindiq borligini kiriting, bot shu asosida umumiy narxni avtomatik hisoblaydi. Bu aniq va shaffof hisob-kitobni ta’minlaydi.`, {
            reply_markup: { inline_keyboard: buttons },
        });
    }
    async onLocation(ctx) {
        ctx.session ??= {};
        const message = ctx.message;
        if (!message || !('location' in message))
            return;
        const { latitude, longitude } = message.location;
        const order = ctx.session.order;
        if (!order || order.step !== 'awaiting_address_input')
            return;
        order.address = `${latitude}, ${longitude}`;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        order.address = googleMapsUrl;
        await ctx.reply(`📍 Joylashuv qabul qilindi.\n\n` +
            `🔗 <a href="${googleMapsUrl}">Google Mapsda ochish</a>`, {
            parse_mode: 'HTML',
            reply_markup: { remove_keyboard: true },
        });
        if (!ctx.from?.id)
            return;
        const user = await this.prisma.user.findUnique({
            where: { telegramId: String(ctx.from.id) },
        });
        const tariffRegion = await this.prisma.tariffRegion.findFirst({
            where: { regionId: order.regionId },
            include: { tariff: true },
        });
        if (!tariffRegion) {
            await ctx.reply('❗ Tarif topilmadi.');
            return;
        }
        const totalPrice = (order.quantity ?? 0) * tariffRegion.pricePerM2;
        const createdOrder = await this.prisma.order.create({
            data: {
                userId: user?.id,
                address: `https://www.google.com/maps?q=${latitude},${longitude}`,
                fullName: order.fullName,
                phone: order.phone,
                comment: order.comment,
                regionId: order.regionId,
                status: 'PENDING',
                items: {
                    create: [
                        {
                            tariffId: tariffRegion.tariff.id,
                            area: order.quantity || 0,
                            price: totalPrice,
                            regionId: order.regionId || 1,
                        },
                    ],
                },
            },
            include: { items: true },
        });
        const orderList = [
            user?.id,
            order.fullName,
            order.phone,
            order.address,
            tariffRegion.tariff.serviceName,
            totalPrice,
            new Date(),
        ];
        await this.googleSheets.writeOrders(orderList);
        await ctx.reply(`✅ Buyurtma saqlandi!\n\n` +
            `📌 Xizmat: *${tariffRegion.tariff.serviceName}*\n` +
            `💰 Narx: *${totalPrice} so‘m*\n` +
            `🆔 Buyurtma ID: *${createdOrder.id}*\n\n` +
            `Operator tez orada siz bilan bog‘lanadi.`, { parse_mode: 'Markdown' });
        ctx.session.order = null;
    }
    async handleText(ctx) {
        ctx.session = ctx.session || {};
        const order = ctx.session.order;
        if (!order || !order.step)
            return;
        const text = ctx.message.text.trim();
        switch (order.step) {
            case 'awaiting_area': {
                const area = parseFloat(text);
                if (isNaN(area) || area <= 0) {
                    return await ctx.reply('❗️ Iltimos, to‘g‘ri maydon (m²) kiriting.');
                }
                order.area = area;
                order.step = 'awaiting_quantity';
                const services = await this.prisma.tariffRegion.findMany({
                    include: { tariff: true },
                });
                const buttons = services.map((s) => [
                    {
                        text: `${s.tariff.serviceName} - ${s.pricePerM2}`,
                        callback_data: `service_${s.id}`,
                    },
                ]);
                await ctx.reply('Qaysi xizmatni tanlaysiz?', {
                    reply_markup: { inline_keyboard: buttons },
                });
                break;
            }
            case 'awaiting_quantity': {
                const quantity = parseFloat(text);
                if (isNaN(quantity) || quantity <= 0) {
                    return await ctx.reply('❗️ Iltimos, to‘g‘ri qiymat kiriting.');
                }
                order.quantity = quantity;
                order.step = 'awaiting_fullName';
                await ctx.reply('To‘liq ism va familiyangizni kiriting:');
                break;
            }
            case 'awaiting_fullName':
                if (!text)
                    return await ctx.reply('❗️ Ism va familiya kiriting.');
                order.fullName = text;
                order.step = 'awaiting_address';
                await ctx.reply('Telefon raqamingizni kiriting:');
                break;
            case 'awaiting_phone':
                order.phone = text;
                order.step = 'awaiting_address';
                await ctx.reply('Manzilingizni kiriting yoki joylashuvingizni yuboring:', {
                    reply_markup: {
                        keyboard: [
                            [{ text: '📍 Joylashuvni yuborish', request_location: true }],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
                break;
            case 'awaiting_address':
                order.phone = text;
                order.step = 'awaiting_address_input';
                await ctx.reply('Iltimos, manzilingizni kiriting yoki hozirgi joylashuvingizni yuboring:', {
                    reply_markup: {
                        keyboard: [
                            [{ text: '📍 Joylashuvni yuborish', request_location: true }],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
                break;
            case 'awaiting_address_input':
                ctx.session = ctx.session || {};
                const orderr = ctx.session.order;
                if (ctx.message?.location) {
                    orderr.address = `Lat: ${ctx.message.location.latitude}, Lon: ${ctx.message.location.longitude}`;
                }
                else if (ctx.message?.text) {
                    orderr.address = ctx.message.text.trim();
                }
                else {
                    return await ctx.reply('❗️ Iltimos, manzilingizni kiriting yoki joylashuvingizni yuboring.');
                }
                await this.saveOrder(ctx, order);
                break;
            case 'awaiting_comment': {
                if (ctx.callbackQuery?.data === 'skip_comment') {
                    order.comment = '';
                }
                else {
                    order.comment = text === '-' ? null : text;
                }
                const tgId = String(ctx.from.id);
                let user = await this.prisma.user.findUnique({
                    where: { telegramId: tgId },
                });
                if (!user) {
                    user = await this.prisma.user.create({
                        data: {
                            telegramId: tgId,
                            fullName: order.fullName,
                            phone: order.phone,
                        },
                    });
                }
                else {
                    await this.prisma.user.update({
                        where: { id: user.id },
                        data: { fullName: order.fullName, phone: order.phone },
                    });
                }
                const tariffRegion = await this.prisma.tariffRegion.findFirst({
                    where: { tariffId: order.tariffId, regionId: order.regionId },
                    include: { tariff: true },
                });
                if (!tariffRegion)
                    return await ctx.reply('❗️ Xizmat topilmadi.');
                const totalPrice = (order.quantity ?? 0) * tariffRegion.pricePerM2;
                if (order.category == client_1.Services.BASSEYN ||
                    client_1.Services.PARDA == order.category ||
                    order.category == client_1.Services.BRUSCHATKA ||
                    order.category == client_1.Services.FASAD ||
                    order.category == client_1.Services.GILAM) {
                }
                const orderList = [
                    user.id,
                    order.fullName,
                    order.phone,
                    order.address,
                    tariffRegion.tariff.serviceName,
                    totalPrice,
                    new Date(),
                ];
                await this.googleSheets.writeOrders(orderList);
                const createdOrder = await this.prisma.order.create({
                    data: {
                        userId: user.id,
                        address: order.address,
                        fullName: order.fullName,
                        phone: order.phone,
                        comment: order.comment,
                        status: 'PENDING',
                        items: {
                            create: [
                                {
                                    tariffId: tariffRegion.tariff.id,
                                    area: order.quantity || 0,
                                    price: totalPrice,
                                    regionId: order.regionId || 1,
                                },
                            ],
                        },
                    },
                    include: { items: true },
                });
                await ctx.reply(`✅ Buyurtma saqlandi!\n\n` +
                    `📌 Xizmat: *${tariffRegion.tariff.serviceName}*\n` +
                    `💰 Narx: *${totalPrice} so‘m*\n` +
                    `🆔 Buyurtma ID: *${createdOrder.id}*\n\n` +
                    `Operator tez orada siz bilan bog‘lanadi.`, { parse_mode: 'Markdown' });
                ctx.session.order = null;
                break;
            }
            default:
                return;
        }
    }
    async handleCallback(ctx) {
        ctx.session = ctx.session || {};
        const order = ctx.session.order;
        if (!order || !order.step)
            return;
        const data = ctx.callbackQuery.data;
        await ctx.answerCbQuery();
        if (data === 'skip_comment') {
            const order = ctx.session.order;
            if (!order)
                return;
            order.comment = null;
            const tgId = String(ctx.from.id);
            let user = await this.prisma.user.findUnique({
                where: { telegramId: tgId },
            });
            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        telegramId: tgId,
                        fullName: order.fullName,
                        phone: order.phone,
                    },
                });
            }
            const tariffRegion = await this.prisma.tariffRegion.findFirst({
                where: { tariffId: order.tariffId, regionId: order.regionId },
                include: { tariff: true },
            });
            if (!tariffRegion) {
                await ctx.reply('❗ Tarif yoki xizmat narxi topilmadi.');
                return;
            }
            const totalPrice = (order.quantity ?? 0) * tariffRegion.pricePerM2;
            const orderList = [
                user.id,
                order.fullName,
                order.phone,
                order.address,
                tariffRegion.tariff.serviceName,
                totalPrice,
                new Date(),
            ];
            await this.googleSheets.writeOrders(orderList);
            const createdOrder = await this.prisma.order.create({
                data: {
                    userId: user.id,
                    address: order.address,
                    fullName: order.fullName,
                    phone: order.phone,
                    comment: null,
                    status: 'PENDING',
                    items: {
                        create: [
                            {
                                tariffId: tariffRegion.tariff.id,
                                area: order.quantity ?? 0,
                                price: totalPrice,
                                regionId: order.regionId,
                            },
                        ],
                    },
                },
            });
            await ctx.reply(`✅ Buyurtma saqlandi!\n\n` +
                `📌 Xizmat: *${tariffRegion.tariff.serviceName}*\n` +
                `💰 Narx: *${totalPrice} so‘m*\n` +
                `🆔 Buyurtma ID: *${createdOrder.id}*\n\n` +
                `Operator tez orada siz bilan bog‘lanadi.`, { parse_mode: 'Markdown' });
            ctx.session.order = null;
            return;
        }
        if (order.step === 'awaiting_region' && data.startsWith('region_')) {
            const regionId = parseInt(data.split('_')[1]);
            order.regionId = regionId;
            order.step = 'awaiting_category';
            const servicesButtons = Object.values(client_1.Services).map((s) => [
                { text: s, callback_data: `category_${s}` },
            ]);
            await ctx.reply('Iltimos, xizmat turini tanlang! 👇🏻', {
                reply_markup: { inline_keyboard: servicesButtons },
            });
            return;
        }
        if (order.step === 'awaiting_category' && data.startsWith('category_')) {
            const category = data.split('_')[1];
            order.category = category;
            order.step = 'awaiting_service';
            const tariffRegions = await this.prisma.tariffRegion.findMany({
                where: {
                    regionId: order.regionId,
                    tariff: { category, isActive: true },
                },
                include: { tariff: true },
            });
            if (!tariffRegions.length)
                return await ctx.reply('Bu hudud va xizmat turiga tegishli tariflar mavjud emas.');
            const buttons = tariffRegions.map((tr) => [
                {
                    text: tr.tariff.serviceName,
                    callback_data: `service_${tr.tariff.id}`,
                },
            ]);
            await ctx.reply('Iltimos, tarifni tanlang! 👇🏻', {
                reply_markup: { inline_keyboard: buttons },
            });
            return;
        }
        if (order.step === 'awaiting_service' && data.startsWith('service_')) {
            const serviceId = parseInt(data.split('_')[1]);
            order.tariffId = serviceId;
            const tariff = await this.prisma.tariff.findUnique({
                where: { id: serviceId },
            });
            if (!tariff)
                return await ctx.reply('❗️ Xizmat topilmadi.');
            if (order.category == client_1.Services.BASSEYN ||
                client_1.Services.PARDA == order.category ||
                order.category == client_1.Services.BRUSCHATKA ||
                order.category == client_1.Services.FASAD ||
                order.category == client_1.Services.GILAM) {
                order.step = 'awaiting_quantity';
                await ctx.reply('Gilam maydonini m² da kiriting:');
            }
            else if (order.category == client_1.Services.MEBEL) {
                order.step = 'awaiting_quantity';
                await ctx.reply(`1 ta o'rindiq soni`);
            }
            else {
                order.step = 'awaiting_quantity';
                await ctx.reply('Nechta dona? Kiriting:');
            }
            return;
        }
    }
    async saveOrder(ctx, order) {
        const tgId = String(ctx.from.id);
        let user = await this.prisma.user.findUnique({
            where: { telegramId: tgId },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    telegramId: tgId,
                    fullName: order.fullName,
                    phone: order.phone,
                },
            });
        }
        else {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { fullName: order.fullName, phone: order.phone },
            });
        }
        const tariffRegion = await this.prisma.tariffRegion.findFirst({
            where: { tariffId: order.tariffId, regionId: order.regionId },
            include: { tariff: true },
        });
        if (!tariffRegion)
            return await ctx.reply('❗️ Xizmat topilmadi.');
        const totalPrice = (order.quantity ?? 0) * tariffRegion.pricePerM2;
        const orderList = [
            user.id,
            order.fullName,
            order.phone,
            order.address,
            tariffRegion.tariff.serviceName,
            totalPrice,
            new Date(),
        ];
        await this.googleSheets.writeOrders(orderList);
        const createdOrder = await this.prisma.order.create({
            data: {
                userId: user.id,
                address: order.address,
                fullName: order.fullName,
                phone: order.phone,
                status: 'PENDING',
                items: {
                    create: [
                        {
                            tariffId: tariffRegion.tariff.id,
                            area: order.quantity || 0,
                            price: totalPrice,
                            regionId: order.regionId || 1,
                        },
                    ],
                },
            },
            include: { items: true },
        });
        await ctx.reply(`✅ Buyurtma saqlandi!\n\n` +
            `📌 Xizmat: *${tariffRegion.tariff.serviceName}*\n` +
            `💰 Narx: *${totalPrice} so‘m*\n` +
            `🆔 Buyurtma ID: *${createdOrder.id}*\n\n` +
            `Operator tez orada siz bilan bog‘lanadi.`, { parse_mode: 'Markdown' });
        ctx.session.order = null;
    }
};
exports.TelegramUpdate = TelegramUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_2.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "start", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('contact_operator'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_2.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handleContactOperator", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('my_orders'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handleMyOrders", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('prices'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_2.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handlePrices", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('about'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_2.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handleAbout", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/prices_region_\d+/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handleRegionPrices", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/prices_category_.+/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handlePricesCategory", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('order'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handleOrder", null);
__decorate([
    (0, nestjs_telegraf_1.On)('location'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onLocation", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handleText", null);
__decorate([
    (0, nestjs_telegraf_1.On)('callback_query'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "handleCallback", null);
exports.TelegramUpdate = TelegramUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    __param(1, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegraf_1.Telegraf,
        google_sheets_service_1.GoogleSheetsService])
], TelegramUpdate);
//# sourceMappingURL=telegram.update.js.map
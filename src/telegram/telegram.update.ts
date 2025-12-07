import { Injectable } from '@nestjs/common';
import { Services } from '@prisma/client';
import { Update, Start, Ctx, Action, On, InjectBot, Phone } from 'nestjs-telegraf';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {  Telegraf, session } from 'telegraf';

interface OrderSession {
  step?: string;
  area?: number;
  quantity?: number; // 👈 ADD
  tariffId?: number;
  regionId?: number;
  category?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  comment?: string;
  service?:String
}


import { Context } from 'telegraf';

export interface SessionData {
  order?: any;
  step?: string;
}

export interface MyContext extends Context {
  session?: SessionData;
}



@Update()
@Injectable()
export class TelegramUpdate {
  constructor(
    private prisma: PrismaService,
    @InjectBot() private bot: Telegraf<Context>,
    private readonly googleSheets: GoogleSheetsService,
  ) {}

  async notifyUser(order: any) {
    if (!order?.user?.telegramId) return;

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
    } catch (err) {
      console.error('Telegram xabar yuborilmadi:', err);
    }
  }

  /** START BOT */
  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      ` Assalomu alaykum, hurmatli mijoz! 🙂

Sizni bizning xizmat botimizda ko‘rib turganimizdan xursandmiz.

Xizmatlar bilan tanishish yoki buyurtma berish uchun  menyudan foydalaning 👇
`,
      {
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
      },
    );
  }
  @Action('contact_operator')
  async handleContactOperator(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply(
      `
      📞 Bizning qo‘llab-quvvatlash markazi sizga yordam berishga tayyor!

Agar savollaringiz bo‘lsa yoki buyurtma bo‘yicha qo‘shimcha ma’lumot kerak bo‘lsa, quyidagi raqam orqali operatorimiz bilan bog‘lanishingiz mumkin:

📱 +998732003636

⏱ Ish vaqti: 09:00 — 21:00 (har kuni)

Operatorlarimiz sizning murojaatingizni imkon qadar tezda ko‘rib chiqadi va yordam beradi. 🙂
`,
    );
  }

  @Action('my_orders')
  async handleMyOrders(@Ctx() ctx: any) {
    await ctx.answerCbQuery();

    const telegramId = String(ctx.from.id);

    // Userni olish
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      return await ctx.reply('❗️ Sizda hali buyurtmalar mavjud emas.');
    }

    // Userning barcha buyurtmalarini olish
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

      const msg =
        `🆔 *Buyurtma ID:* ${order.id}\n` +
        `📅 Sana: ${order.createdAt.toLocaleString('uz-UZ')}\n` +
        `📌 Status: *${order.status}*\n\n` +
        `🧾 Xizmatlar:\n${itemsText}\n` +
        `💰 *Jami:* ${total.toLocaleString()} so‘m\n`;

      await ctx.reply(msg, { parse_mode: 'Markdown' });
    }
  }

  /** SHOW PRICES */
  // regionlari tanlash uchun action
  @Action('prices')
  async handlePrices(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();

    // barcha regionlarni olish
    const regions = await this.prisma.regions.findMany();

    if (regions.length === 0) {
      await ctx.reply('Hozircha hududlar mavjud emas.');
      return;
    }

    // inline tugmachalarni yaratish
    const buttons = regions.map((region) => [
      { text: region.name, callback_data: `prices_region_${region.id}` },
    ]);

    await ctx.reply('Iltimos, hududni tanlang! 👇🏻', {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }

  @Action('about')
  async handleAbout(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply(
      `
              “Ishonch”


“Ishonch” gilam yuvish korxonasi 2017-yil 4-dekabrda Alimov Muxiddin tomonidan avtoyuvish shoxobchasi sifatida ochilgan bo‘lib, keyinchalik faoliyatini gilam yuvishga o‘zgartirgan.
2017 yilda 3 kishidan iborat jamoa 120 dan ortiq xodimlarga ega bo'lgan ahil jamoaga aylandi. Bu yo‘nalishda 400 dan ortiq talabalarimiz bor. Bugungi kunda O‘zbekistonning 10 ta shahar va viloyatida filiallarimiz faoliyat ko‘rsatmoqda. Hammasi bo'lib 1 million kvadrat metrdan ortiq gilam yuvildi, bu taxminan 100 ming donadan ortiq.
Nega bizni tanlashadi?



✅  Sifat kafolati

✅  Toza va xavfsiz tozalash

✅  Tajriba va ishonch

✅  Bepul olib ketish va yetkazib berish
`,
    );
  }

  // hudud bo'yicha tariflarni chiqarish
  @Action(/prices_region_\d+/)
  async handleRegionPrices(@Ctx() ctx: Context & any) {
    await ctx.answerCbQuery();

    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const regionId = Number(ctx.callbackQuery.data.split('_')[2]);
    ctx.session = ctx.session || {};
    ctx.session.prices = { regionId };

    // Category tugmalari (Services enum)
    const categoryButtons = Object.values(Services).map((c) => [
      { text: c, callback_data: `prices_category_${c}` },
    ]);

    await ctx.reply('Qaysi xizmat turi bilan tanishmoqchisiz?', {
      reply_markup: { inline_keyboard: categoryButtons },
    });
  }

  @Action(/prices_category_.+/)
  async handlePricesCategory(@Ctx() ctx: Context & any) {
    await ctx.answerCbQuery();

    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

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
      if (tr.tariff.description) msg += `📝 ${tr.tariff.description}`;

      await ctx.reply(msg, { parse_mode: 'Markdown' });
    }
  }

  /** BUYURTMA BOSHLASH */
  @Action('order')
  async handleOrder(@Ctx() ctx: any) {
    ctx.session = ctx.session || {};
    ctx.session.order = {} as OrderSession;
    ctx.session.order.step = 'awaiting_region';

    const regions = await this.prisma.regions.findMany({
      orderBy: { name: 'asc' },
    });

    if (!regions.length) {
      return await ctx.reply(
        '❗️ Hozircha hududlar mavjud emas. Admin bilan bog‘laning.',
      );
    }

    const buttons = regions.map((r) => [
      { text: r.name, callback_data: `region_${r.id}` },
    ]);

    await ctx.reply(`Iltimos, xizmat turini tanlang! 👇🏻`, {
      reply_markup: { inline_keyboard: buttons },
    });
  }
  /** LOCATION SENDING */

  @On('location')
  async onLocation(@Ctx() ctx: MyContext) {
    ctx.session ??= {}; // ❗ Sessionni o‘chirib yubormang
    const message = ctx.message;

    if (!message || !('location' in message)) return;

    const { latitude, longitude } = message.location;

    const order = ctx.session.order;
    if (!order || order.step !== 'awaiting_address_input') return;

    // Manzilni saqlaymiz
    order.address = `${latitude}, ${longitude}`;

    // Manzilni Google Maps URLga aylantiramiz
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Manzilni orderga saqlaymiz
    order.address = googleMapsUrl;

    // Foydalanuvchiga yuboramiz
    await ctx.reply(
      `📍 Joylashuv qabul qilindi.\n\n` +
        `🔗 <a href="${googleMapsUrl}">Google Mapsda ochish</a>`,
      {
        parse_mode: 'HTML',
        reply_markup: { remove_keyboard: true },
      },
    );

    if (!ctx.from?.id) return;

    // USER
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(ctx.from.id) },
    });

    // if (!user) {
    //   await ctx.reply('❗ Foydalanuvchi topilmadi. Iltimos /start ni bosing.');
    //   return;
    // }

    // TARIF REGION
    const tariffRegion = await this.prisma.tariffRegion.findFirst({
      where: { regionId: order.regionId },
      include: { tariff: true },
    });

    if (!tariffRegion) {
      await ctx.reply('❗ Tarif topilmadi.');
      return;
    }

    // hisoblash pricePerM2 * area
    const totalPrice = (order.quantity ?? 0) * tariffRegion.pricePerM2;


    // BUYURTMANI SAQLAYMIZ
    const createdOrder = await this.prisma.order.create({
      data: {
        userId: user?.id ,
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
        order.fullName,
        order.phone,
        order.address,
        order.category,
        tariffRegion.tariff.serviceName,
        order.quantity || 0,
        totalPrice,
        new Date(),
      ];
    await this.googleSheets.writeOrders(orderList);

    await ctx.reply(
      `✅ Buyurtma saqlandi!\n\n` +
        `📌 Xizmat: *${tariffRegion.tariff.serviceName}*\n` +
        `💰 Narx: *${totalPrice} so‘m*\n` +
        `🆔 Buyurtma ID: *${createdOrder.id}*\n\n` +
        `Operator tez orada siz bilan bog‘lanadi.`,
      { parse_mode: 'Markdown' },
    );

    // SESSION TOZALASH
    ctx.session.order = null;
  }

  /** TEXT INPUT HANDLER */
  @On('text')
  async handleText(@Ctx() ctx: any) {
    ctx.session = ctx.session || {};
    const order: OrderSession = ctx.session.order;
    if (!order || !order.step) return;

    const text = ctx.message.text.trim();

    switch (order.step) {
      /** STEP 1: AREA */
      case 'awaiting_area': {
        const area = parseFloat(text);
        if (isNaN(area) || area <= 0) {
          return await ctx.reply('❗️ Iltimos, to‘g‘ri maydon (m²) kiriting.');
        }

        order.area = area; // faqat area saqlaymiz
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

      /** STEP: QUANTITY OR AREA */
      case 'awaiting_quantity': {
        const quantity = parseFloat(text);
        if (isNaN(quantity) || quantity <= 0) {
          return await ctx.reply('❗️ Iltimos, to‘g‘ri qiymat kiriting.');
        }
        order.quantity = quantity;
        order.step = 'awaiting_fullName'; // keyingi stepga o‘tish
        await ctx.reply('To‘liq ism va familiyangizni kiriting:');
        break;
      }

      /** STEP 2: FULL NAME */
      case 'awaiting_fullName':
        if (!text) return await ctx.reply('❗️ Ism va familiya kiriting.');
        order.fullName = text;
        order.step = 'awaiting_address';
        await ctx.reply('Telefon raqamingizni kiriting:');
        break;

      /** STEP 3: PHONE */
      case 'awaiting_phone':
        order.phone = text;
        order.step = 'awaiting_address';

        await ctx.reply(
          'Manzilingizni kiriting yoki joylashuvingizni yuboring:',
          {
            reply_markup: {
              keyboard: [
                [{ text: '📍 Joylashuvni yuborish', request_location: true }],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          },
        );
        break;

      /** STEP 4: ADDRESS */
      /** STEP 4: ADDRESS */
      case 'awaiting_address':
        order.phone = text;
        order.step = 'awaiting_address_input';
        await ctx.reply(
          'Iltimos, manzilingizni kiriting yoki hozirgi joylashuvingizni yuboring:',
          {
            reply_markup: {
              keyboard: [
                [{ text: '📍 Joylashuvni yuborish', request_location: true }],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          },
        );
        break;

      /** STEP 5: AWAITING ADRES INPUT */
      case 'awaiting_address_input':
        ctx.session = ctx.session || {};
        const orderr: OrderSession = ctx.session.order;

        // Agar foydalanuvchi location yuborsa
        if (ctx.message?.location) {
          orderr.address = `Lat: ${ctx.message.location.latitude}, Lon: ${ctx.message.location.longitude}`;
        }
        // Agar foydalanuvchi text yuborsa
        else if (ctx.message?.text) {
          orderr.address = ctx.message.text.trim();
        } else {
          return await ctx.reply(
            '❗️ Iltimos, manzilingizni kiriting yoki joylashuvingizni yuboring.',
          );
        }

        // Bu yerda buyurtmani saqlash funksiyasini chaqiramiz
        await this.saveOrder(ctx, order);
        break;

      /** STEP 5: COMMENT & CONFIRMATION */
      case 'awaiting_comment': {
        // AGAR USER "O‘tkazish" tugmasini bossachi?
        if (ctx.callbackQuery?.data === 'skip_comment') {
          order.comment = '';
        } else {
          order.comment = text === '-' ? null : text;
        }

        // FINAL STEP: SAVE ORDER
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
        } else {
          await this.prisma.user.update({
            where: { id: user.id },
            data: { fullName: order.fullName, phone: order.phone },
          });
        }

        // get tariff
        const tariffRegion = await this.prisma.tariffRegion.findFirst({
          where: { tariffId: order.tariffId, regionId: order.regionId },
          include: { tariff: true },
        });

        if (!tariffRegion) return await ctx.reply('❗️ Xizmat topilmadi.');

        const totalPrice = (order.quantity ?? 0) * tariffRegion.pricePerM2;
        if (
          order.category == Services.BASSEYN ||
          Services.PARDA == order.category ||
          order.category == Services.BRUSCHATKA ||
          order.category == Services.FASAD ||
          order.category == Services.GILAM
        ) {
        }

      const orderList = [
        order.fullName,
        order.phone,
        order.address,
        tariffRegion.tariff.serviceName,
        order.quantity || 0,
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

        await ctx.reply(
          `✅ Buyurtma saqlandi!\n\n` +
            `📌 Xizmat: *${tariffRegion.tariff.serviceName}*\n` +
            `💰 Narx: *${totalPrice} so‘m*\n` +
            `🆔 Buyurtma ID: *${createdOrder.id}*\n\n` +
            `Operator tez orada siz bilan bog‘lanadi.`,
          { parse_mode: 'Markdown' },
        );

        ctx.session.order = null; // session tozalash
        break;
      }

      default:
        return;
    }
  }

  /** HANDLE TARIFF CALLBACK */
  @On('callback_query')
  async handleCallback(@Ctx() ctx: any) {
    ctx.session = ctx.session || {};
    const order: OrderSession = ctx.session.order;
    if (!order || !order.step) return;

    const data: string = ctx.callbackQuery.data;
    await ctx.answerCbQuery();

    /** SKIP COMMENT */

    if (data === 'skip_comment') {
      const order = ctx.session.order;
      if (!order) return;

      order.comment = null;

      // USER
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

      // TARIFNI OLAMIZ
      const tariffRegion = await this.prisma.tariffRegion.findFirst({
        where: { tariffId: order.tariffId, regionId: order.regionId },
        include: { tariff: true },
      });

      // ❗ Majburiy tekshiruv - shu bo‘lmasa TypeScript xato beradi
      if (!tariffRegion) {
        await ctx.reply('❗ Tarif yoki xizmat narxi topilmadi.');
        return;
      }

      // Endi TypeScript bu yerga kelganimizda tariffRegion 100% bor deb hisoblaydi
      const totalPrice = (order.quantity ?? 0) * tariffRegion.pricePerM2;
    
      const orderList = [
        order.fullName,
        order.phone,
        order.address,
        tariffRegion.tariff.serviceName,
        order.
        order.quantity || 0,
        totalPrice,
        new Date(),
      ];
      await this.googleSheets.writeOrders(orderList);

      // ORDER
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

      await ctx.reply(
        `✅ Buyurtma saqlandi!\n\n` +
          `📌 Xizmat: *${tariffRegion.tariff.serviceName}*\n` +
          `💰 Narx: *${totalPrice} so‘m*\n` +
          `🆔 Buyurtma ID: *${createdOrder.id}*\n\n` +
          `Operator tez orada siz bilan bog‘lanadi.`,
        { parse_mode: 'Markdown' },
      );

      ctx.session.order = null;
      return;
    }

    /** REGION TANLASH */
    if (order.step === 'awaiting_region' && data.startsWith('region_')) {
      const regionId = parseInt(data.split('_')[1]);
      order.regionId = regionId;
      order.step = 'awaiting_category';

      // Services enum tugmalari
      const servicesButtons = Object.values(Services).map((s) => [
        { text: s, callback_data: `category_${s}` },
      ]);

      await ctx.reply('Iltimos, xizmat turini tanlang! 👇🏻', {
        reply_markup: { inline_keyboard: servicesButtons },
      });
      order.service = ctx.text
      return;
    }
    /** CATEGORY TANLASH */
    if (order.step === 'awaiting_category' && data.startsWith('category_')) {
      const category = data.split('_')[1] as Services;
      order.category = category;
      order.step = 'awaiting_service';

      // Tanlangan category ga tegishli faqat xizmatlarni olish
      const tariffRegions = await this.prisma.tariffRegion.findMany({
        where: {
          regionId: order.regionId,
          tariff: { category, isActive: true },
        },
        include: { tariff: true },
      });

      if (!tariffRegions.length)
        return await ctx.reply(
          'Bu hudud va xizmat turiga tegishli tariflar mavjud emas.',
        );

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

    /** SERVICE TANLASH */
    if (order.step === 'awaiting_service' && data.startsWith('service_')) {
      const serviceId = parseInt(data.split('_')[1]);
      order.tariffId = serviceId;

      const tariff = await this.prisma.tariff.findUnique({
        where: { id: serviceId },
      });

      if (!tariff) return await ctx.reply('❗️ Xizmat topilmadi.');

      // GILAM bo‘lsa m², boshqa bo‘lsa dona so‘rash
      if (
        order.category == Services.BASSEYN ||
        Services.PARDA == order.category ||
        order.category == Services.BRUSCHATKA ||
        order.category == Services.FASAD ||
        order.category == Services.GILAM
      ) {
        order.step = 'awaiting_quantity';
        await ctx.reply('Gilam maydonini m² da kiriting:');
      } else if (order.category == Services.MEBEL) {
        order.step = 'awaiting_quantity';
        await ctx.reply(
          `Mebelingiz o‘rindiqlar soni bo‘yicha yuviladi. Buyurtma berayotganda nechta o‘rindiq borligini kiriting, bot shu asosida umumiy narxni avtomatik hisoblaydi. Bu aniq va shaffof hisob-kitobni ta’minlaydi.`,
        );
      } else {
        order.step = 'awaiting_quantity';
        await ctx.reply('Nechta dona? Kiriting:');
      }

      return;
    }

    /** SKIP COMMENT */

    /** MY ORDERS */

    /** CONTACT OPERATOR */
    // @Action('contact_operator')
    // async handleContactOperator(@Ctx() ctx: Context) {
    //   await ctx.answerCbQuery();
    //   await ctx.reply(
    //     `Qo‘llab-quvvatlash xizmati:\n+998-90-123-45-67\nSavollaringiz bo‘lsa, bemalol murojaat qiling.`,
    //   );
    // }
  }
  private async saveOrder(ctx: any, order: OrderSession) {
    const tgId = String(ctx.from.id);

    // USER
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
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { fullName: order.fullName, phone: order.phone },
      });
    }

    // TARIF
    const tariffRegion = await this.prisma.tariffRegion.findFirst({
      where: { tariffId: order.tariffId, regionId: order.regionId },
      include: { tariff: true },
    });

    if (!tariffRegion) return await ctx.reply('❗️ Xizmat topilmadi.');

    const totalPrice = (order.quantity ?? 0) * tariffRegion.pricePerM2;
    const orderList = [
      order.fullName,
      order.phone,
      order.address,
      tariffRegion.tariff.serviceName,
      order.quantity || 0,
      totalPrice,
      new Date(),
      
    ];
    await this.googleSheets.writeOrders(orderList);
    

    // ORDER
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

    await ctx.reply(
      `✅ Buyurtma saqlandi!\n\n` +
        `📌 Xizmat: *${tariffRegion.tariff.serviceName}*\n` +
        `💰 Narx: *${totalPrice} so‘m*\n` +
        `🆔 Buyurtma ID: *${createdOrder.id}*\n\n` +
        `Operator tez orada siz bilan bog‘lanadi.`,
      { parse_mode: 'Markdown' },
    );

    // SESSION TOZALASH
    ctx.session.order = null;
  }
}
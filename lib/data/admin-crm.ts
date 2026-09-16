export type DealSource = 'site' | 'telegram' | 'phone'

export type Deal = {
  id: string
  client: string
  phone: string
  type: string
  amount: number
  stage: string
  manager: string
  source: DealSource
  createdAt: string
  note: string
}

export const stages: { key: string; label: string; tone: 'new' | 'work' | 'warm' | 'won' | 'lost' }[] = [
  { key: 'new', label: 'Новая', tone: 'new' },
  { key: 'contact', label: 'Контакт', tone: 'new' },
  { key: 'measure', label: 'Замер', tone: 'warm' },
  { key: 'estimate', label: 'Смета', tone: 'warm' },
  { key: 'contract', label: 'Договор', tone: 'work' },
  { key: 'inwork', label: 'В работе', tone: 'work' },
  { key: 'done', label: 'Завершена', tone: 'won' },
  { key: 'lost', label: 'Отказ', tone: 'lost' },
]

export const managers = ['Андрей Ким', 'Салтанат Б.', 'Ержан Т.', 'Динара О.']

export const deals: Deal[] = [
  { id: 'D-2041', client: 'Алексей Иванов', phone: '+7 701 220 14 08', type: 'Ремонт ванной под ключ', amount: 640000, stage: 'new', manager: 'Андрей Ким', source: 'site', createdAt: '2026-09-08T10:42:00', note: 'Хрущёвка, 4 м². Просит смету на этой неделе.' },
  { id: 'D-2040', client: 'Марина Соколова', phone: '+7 705 118 77 30', type: 'Электромонтаж под ключ', amount: 310000, stage: 'new', manager: 'Ержан Т.', source: 'telegram', createdAt: '2026-09-08T09:18:00', note: 'Двушка, полная замена проводки.' },
  { id: 'D-2039', client: 'ТОО «Астэк»', phone: '+7 727 350 09 12', type: 'Офис под ключ, 120 м²', amount: 5400000, stage: 'contract', manager: 'Андрей Ким', source: 'phone', createdAt: '2026-09-05T14:00:00', note: 'Договор на согласовании у юриста.' },
  { id: 'D-2038', client: 'Данияр Нурланов', phone: '+7 708 441 22 65', type: 'Заказ материалов', amount: 118400, stage: 'estimate', manager: 'Динара О.', source: 'site', createdAt: '2026-09-07T18:36:00', note: 'Сухие смеси + плитка, ждёт счёт.' },
  { id: 'D-2037', client: 'Ольга Ким', phone: '+7 701 900 55 41', type: 'Укладка плитки', amount: 96000, stage: 'measure', manager: 'Салтанат Б.', source: 'telegram', createdAt: '2026-09-06T16:20:00', note: 'Замер назначен на завтра 14:00.' },
  { id: 'D-2036', client: 'Айгерим Т.', phone: '+7 777 610 30 20', type: 'Ремонт кухни под ключ', amount: 890000, stage: 'measure', manager: 'Ержан Т.', source: 'site', createdAt: '2026-09-06T11:05:00', note: 'Нужен дизайн-проект.' },
  { id: 'D-2035', client: 'Сергей Плотников', phone: '+7 705 233 41 90', type: 'Вызов электрика', amount: 45000, stage: 'estimate', manager: 'Динара О.', source: 'phone', createdAt: '2026-09-05T09:40:00', note: 'Не держит УЗО, диагностика.' },
  { id: 'D-2034', client: 'Гульнара Ж.', phone: '+7 701 044 18 76', type: 'Косметический ремонт', amount: 420000, stage: 'contract', manager: 'Салтанат Б.', source: 'site', createdAt: '2026-09-04T13:12:00', note: 'Договор подписан, ждём предоплату.' },
  { id: 'D-2033', client: 'Бекзат Мукашев', phone: '+7 708 771 60 05', type: 'Демонтаж + черновые', amount: 260000, stage: 'inwork', manager: 'Андрей Ким', source: 'phone', createdAt: '2026-09-02T10:00:00', note: 'Бригада на объекте, 3 день.' },
  { id: 'D-2032', client: 'Наталья Верещагина', phone: '+7 705 512 09 33', type: 'Ремонт квартиры под ключ', amount: 3200000, stage: 'inwork', manager: 'Ержан Т.', source: 'site', createdAt: '2026-08-28T15:30:00', note: 'Этап: инженерные сети. Фото-отчёт отправлен.' },
  { id: 'D-2031', client: 'Тимур Ахметов', phone: '+7 777 320 88 14', type: 'Гипсокартон и потолки', amount: 175000, stage: 'inwork', manager: 'Салтанат Б.', source: 'telegram', createdAt: '2026-08-27T12:20:00', note: 'Многоуровневый потолок в зале.' },
  { id: 'D-2030', client: 'Аружан Калиева', phone: '+7 701 660 22 47', type: 'Укладка плитки', amount: 110000, stage: 'done', manager: 'Динара О.', source: 'site', createdAt: '2026-08-20T09:00:00', note: 'Сдано, отзыв 5★.' },
  { id: 'D-2029', client: 'Дмитрий Орлов', phone: '+7 708 145 77 90', type: 'Электромонтаж под ключ', amount: 340000, stage: 'done', manager: 'Ержан Т.', source: 'phone', createdAt: '2026-08-15T14:45:00', note: 'Протокол замеров передан клиенту.' },
  { id: 'D-2028', client: 'Елена Смирнова', phone: '+7 705 902 11 08', type: 'Ремонт ванной под ключ', amount: 560000, stage: 'done', manager: 'Андрей Ким', source: 'site', createdAt: '2026-08-10T10:30:00', note: 'Гарантия оформлена.' },
  { id: 'D-2027', client: 'Руслан Кенжебаев', phone: '+7 777 011 45 62', type: 'Вызов сантехника', amount: 28000, stage: 'lost', manager: 'Динара О.', source: 'telegram', createdAt: '2026-09-03T17:10:00', note: 'Нашёл мастера сам.' },
  { id: 'D-2026', client: 'Асель Кабенова', phone: '+7 701 778 33 21', type: 'Дизайн-проект', amount: 480000, stage: 'lost', manager: 'Ержан Т.', source: 'site', createdAt: '2026-08-30T11:00:00', note: 'Отложили ремонт до весны.' },
  { id: 'D-2025', client: 'Пётр Гусев', phone: '+7 705 331 90 44', type: 'Заказ материалов', amount: 64000, stage: 'new', manager: 'Динара О.', source: 'site', createdAt: '2026-09-08T08:15:00', note: 'Смета из калькулятора, ждёт звонка.' },
  { id: 'D-2024', client: 'Ксения Волкова', phone: '+7 708 220 71 19', type: 'Ремонт кухни под ключ', amount: 720000, stage: 'contact', manager: 'Салтанат Б.', source: 'telegram', createdAt: '2026-09-07T20:05:00', note: 'Первый контакт, уточняет бюджет.' },
  { id: 'D-2023', client: 'Нурлан Исмаилов', phone: '+7 777 540 12 88', type: 'Устройство полов', amount: 190000, stage: 'contact', manager: 'Андрей Ким', source: 'phone', createdAt: '2026-09-07T13:30:00', note: 'Полусухая стяжка 45 м².' },
  { id: 'D-2022', client: 'Айдос Ералиев', phone: '+7 701 909 66 12', type: 'Электромонтаж', amount: 95000, stage: 'estimate', manager: 'Ержан Т.', source: 'site', createdAt: '2026-09-06T09:55:00', note: 'Смета отправлена, ждём решения.' },
  { id: 'D-2021', client: 'Салтанат Бекова', phone: '+7 705 118 24 70', type: 'Ремонт под ключ', amount: 2400000, stage: 'measure', manager: 'Андрей Ким', source: 'site', createdAt: '2026-09-05T16:40:00', note: 'Новостройка, черновая. Замер в субботу.' },
]

export const sourceLabel: Record<DealSource, string> = { site: 'Сайт', telegram: 'Telegram', phone: 'Телефон' }

export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function money(v: number) {
  return new Intl.NumberFormat('ru-RU').format(v) + ' ₸'
}

export function relTime(iso: string) {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const day = 86400000
  if (diff < day) return 'сегодня'
  if (diff < 2 * day) return 'вчера'
  const n = Math.floor(diff / day)
  return `${n} дн назад`
}

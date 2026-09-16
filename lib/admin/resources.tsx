import type { ResourceConfig } from '@/components/admin/ResourceManager'

const money = (v: number) => new Intl.NumberFormat('ru-RU').format(Math.round(v || 0)) + ' ₸'
const thumb = (src: string) =>
  src ? (
    <img
      src={src}
      alt=""
      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, background: '#eee' }}
    />
  ) : (
    <span style={{ color: '#c7c1b5' }}>—</span>
  )

const UNIT_OPTIONS = [
  { value: 'шт', label: 'шт' },
  { value: 'м²', label: 'м²' },
  { value: 'м³', label: 'м³' },
  { value: 'меш', label: 'меш' },
]
const BADGE_OPTIONS = [
  { value: '', label: 'без бейджа' },
  { value: 'hit', label: 'Хит' },
  { value: 'sale', label: 'Скидка' },
  { value: 'new', label: 'Новинка' },
]

export const productsConfig: ResourceConfig = {
  title: 'Товары',
  subtitle: 'Каталог материалов и инструмента',
  singular: 'товар',
  endpoint: '/manage/products',
  paged: true,
  search: true,
  filters: [
    {
      name: 'category_id',
      label: 'Категория',
      optionsFrom: { endpoint: '/manage/categories', value: 'id', label: 'name' },
    },
  ],
  groupBy: (r) => r.category?.name ?? '—',
  columns: [
    { key: 'image', label: '', width: 56, render: (r) => thumb(r.image) },
    { key: 'name', label: 'Название', render: (r) => <strong>{r.name}</strong> },
    { key: 'category', label: 'Категория', render: (r) => r.category?.name ?? '—' },
    { key: 'brand', label: 'Бренд', render: (r) => r.brand?.name ?? '—' },
    { key: 'price', label: 'Цена', render: (r) => <span className="req-amount">{money(r.price)}</span> },
    { key: 'stock', label: 'Остаток', render: (r) => `${r.stock} ${r.unit}` },
    { key: 'badge', label: 'Бейдж', render: (r) => r.badge || '—' },
  ],
  toForm: (r) => ({ ...r, category_id: r.category?.id, brand_id: r.brand?.id }),
  fields: [
    { name: 'name', label: 'Название', required: true, wide: true },
    { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true, help: 'латиница, цифры и дефис' },
    {
      name: 'category_id',
      label: 'Категория',
      type: 'select',
      required: true,
      optionsFrom: { endpoint: '/manage/categories', value: 'id', label: 'name' },
    },
    {
      name: 'brand_id',
      label: 'Бренд',
      type: 'select',
      required: true,
      optionsFrom: { endpoint: '/manage/brands', value: 'id', label: 'name' },
    },
    { name: 'unit', label: 'Единица', type: 'select', options: UNIT_OPTIONS },
    { name: 'price', label: 'Цена, ₸', type: 'number', required: true, min: 0 },
    { name: 'old_price', label: 'Старая цена, ₸', type: 'number', min: 0, nullable: true, help: 'для скидки; пусто — без скидки' },
    { name: 'stock', label: 'Остаток', type: 'number', min: 0 },
    { name: 'badge', label: 'Бейдж', type: 'select', options: BADGE_OPTIONS },
    { name: 'rating', label: 'Рейтинг', type: 'number', min: 0, max: 5 },
    { name: 'review_count', label: 'Кол-во отзывов', type: 'number', min: 0 },
    { name: 'image', label: 'Главное фото', type: 'image', wide: true },
    { name: 'images', label: 'Галерея (ссылки)', type: 'images', wide: true },
    { name: 'short_description', label: 'Краткое описание', type: 'textarea', wide: true },
    { name: 'description', label: 'Полное описание', type: 'textarea', wide: true },
    { name: 'specs', label: 'Характеристики', type: 'pairs', wide: true },
    { name: 'is_active', label: 'Показывать на сайте', type: 'checkbox', default: true },
  ],
}

export const categoriesConfig: ResourceConfig = {
  title: 'Категории',
  subtitle: 'Разделы каталога',
  singular: 'категория',
  endpoint: '/manage/categories',
  columns: [
    { key: 'image', label: '', width: 56, render: (r) => thumb(r.image) },
    { key: 'name', label: 'Название', render: (r) => <strong>{r.name}</strong> },
    { key: 'slug', label: 'Slug', render: (r) => <span className="req-id">{r.slug}</span> },
    { key: 'position', label: 'Порядок' },
    { key: 'product_count', label: 'Товаров' },
  ],
  fields: [
    { name: 'name', label: 'Название', required: true, wide: true },
    { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true },
    { name: 'description', label: 'Описание', type: 'textarea', wide: true },
    { name: 'image', label: 'Фото', type: 'image', wide: true },
    { name: 'position', label: 'Порядок сортировки', type: 'number', min: 0 },
  ],
}

export const brandsConfig: ResourceConfig = {
  title: 'Бренды',
  subtitle: 'Производители товаров',
  singular: 'бренд',
  endpoint: '/manage/brands',
  columns: [
    { key: 'name', label: 'Название', render: (r) => <strong>{r.name}</strong> },
    { key: 'slug', label: 'Slug', render: (r) => <span className="req-id">{r.slug}</span> },
  ],
  fields: [
    { name: 'name', label: 'Название', required: true, wide: true },
    { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true },
  ],
}

export const servicesConfig: ResourceConfig = {
  title: 'Услуги',
  subtitle: 'Ремонт под ключ и отдельные работы',
  singular: 'услуга',
  endpoint: '/manage/services',
  columns: [
    { key: 'image', label: '', width: 56, render: (r) => thumb(r.image) },
    { key: 'name', label: 'Название', render: (r) => <strong>{r.name}</strong> },
    { key: 'price_from', label: 'Цена от', render: (r) => <span className="req-amount">{money(r.price_from)}</span> },
    { key: 'duration', label: 'Срок' },
  ],
  fields: [
    { name: 'name', label: 'Название', required: true, wide: true },
    { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true },
    { name: 'price_from', label: 'Цена от, ₸', type: 'number', min: 0 },
    { name: 'duration', label: 'Срок', help: 'например «от 14 дней»' },
    { name: 'image', label: 'Обложка', type: 'image', wide: true },
    { name: 'description', label: 'Описание', type: 'textarea', wide: true },
    { name: 'includes', label: 'Что входит', type: 'lines', wide: true },
    { name: 'steps', label: 'Этапы работ', type: 'lines', wide: true },
    { name: 'gallery', label: 'Галерея работ (ссылки)', type: 'images', wide: true },
    { name: 'position', label: 'Порядок', type: 'number', min: 0 },
    { name: 'is_active', label: 'Показывать на сайте', type: 'checkbox', default: true },
  ],
}

export const mastersConfig: ResourceConfig = {
  title: 'Мастера',
  subtitle: 'Каталог специалистов',
  singular: 'мастер',
  endpoint: '/manage/masters',
  paged: true,
  search: true,
  columns: [
    {
      key: 'image',
      label: '',
      width: 56,
      render: (r) =>
        r.image ? (
          <img src={r.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} />
        ) : (
          '—'
        ),
    },
    { key: 'name', label: 'Имя', render: (r) => <strong>{r.name}</strong> },
    { key: 'specialty', label: 'Специализация', render: (r) => (r.specialty || []).join(', ') },
    { key: 'district', label: 'Район' },
    { key: 'rating', label: 'Рейтинг' },
    { key: 'jobs', label: 'Работ' },
    { key: 'verified', label: 'Проверен', render: (r) => (r.verified ? 'да' : '—') },
  ],
  fields: [
    { name: 'name', label: 'Имя', required: true, wide: true },
    { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true },
    { name: 'specialty', label: 'Специализация', type: 'lines', help: 'по одному пункту в строке' },
    { name: 'city', label: 'Город' },
    { name: 'district', label: 'Район' },
    { name: 'rating', label: 'Рейтинг', type: 'number', min: 0, max: 5 },
    { name: 'review_count', label: 'Кол-во отзывов', type: 'number', min: 0 },
    { name: 'jobs', label: 'Выполнено работ', type: 'number', min: 0 },
    { name: 'rate', label: 'Ставка, ₸/смена', type: 'number', min: 0 },
    { name: 'verified', label: 'Проверенный мастер', type: 'checkbox' },
    { name: 'available', label: 'Свободен для заказов', type: 'checkbox', default: true },
    { name: 'image', label: 'Фото', type: 'image', wide: true },
    { name: 'bio', label: 'О себе', type: 'textarea', wide: true },
    { name: 'portfolio', label: 'Портфолио (ссылки)', type: 'images', wide: true },
  ],
}

export const vacanciesConfig: ResourceConfig = {
  title: 'Вакансии',
  subtitle: 'Открытые позиции',
  singular: 'вакансия',
  endpoint: '/manage/vacancies',
  columns: [
    { key: 'title', label: 'Должность', render: (r) => <strong>{r.title}</strong> },
    { key: 'city', label: 'Город' },
    { key: 'employment', label: 'Занятость' },
    { key: 'salary_from', label: 'Зарплата от', render: (r) => <span className="req-amount">{money(r.salary_from)}</span> },
    { key: 'is_open', label: 'Открыта', render: (r) => (r.is_open ? 'да' : '—') },
  ],
  fields: [
    { name: 'title', label: 'Должность', required: true, wide: true },
    { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true },
    { name: 'city', label: 'Город' },
    { name: 'employment', label: 'Тип занятости' },
    { name: 'salary_from', label: 'Зарплата от, ₸', type: 'number', min: 0 },
    { name: 'salary_to', label: 'Зарплата до, ₸', type: 'number', min: 0 },
    { name: 'short', label: 'Кратко', type: 'textarea', wide: true },
    { name: 'responsibilities', label: 'Обязанности', type: 'lines', wide: true },
    { name: 'requirements', label: 'Требования', type: 'lines', wide: true },
    { name: 'conditions', label: 'Условия', type: 'lines', wide: true },
    { name: 'is_open', label: 'Вакансия открыта', type: 'checkbox', default: true },
  ],
}

export const articlesConfig: ResourceConfig = {
  title: 'Советы / блог',
  subtitle: 'Статьи для клиентов',
  singular: 'статья',
  endpoint: '/manage/articles',
  columns: [
    { key: 'image', label: '', width: 56, render: (r) => thumb(r.image) },
    { key: 'title', label: 'Заголовок', render: (r) => <strong>{r.title}</strong> },
    { key: 'category', label: 'Рубрика' },
    { key: 'published_on', label: 'Дата' },
    { key: 'is_published', label: 'Опубл.', render: (r) => (r.is_published ? 'да' : '—') },
  ],
  fields: [
    { name: 'title', label: 'Заголовок', required: true, wide: true },
    { name: 'slug', label: 'Slug (URL)', type: 'slug', required: true },
    { name: 'category', label: 'Рубрика', help: 'Планирование, Технологии, Мастера…' },
    { name: 'excerpt', label: 'Анонс', type: 'textarea', wide: true },
    { name: 'image', label: 'Обложка', type: 'image', wide: true },
    {
      name: 'published_on',
      label: 'Дата публикации',
      type: 'date',
      required: true,
      default: new Date().toISOString().slice(0, 10),
    },
    { name: 'read_min', label: 'Время чтения, мин', type: 'number', min: 1 },
    { name: 'body', label: 'Текст (абзацы)', type: 'lines', wide: true, help: 'каждый абзац с новой строки' },
    { name: 'is_published', label: 'Опубликовать', type: 'checkbox', default: true },
  ],
}

export const faqConfig: ResourceConfig = {
  title: 'Вопросы и ответы',
  subtitle: 'FAQ на сайте',
  singular: 'вопрос',
  endpoint: '/manage/faq',
  columns: [
    {
      key: 'section',
      label: 'Раздел',
      render: (r) => (r.section === 'services' ? 'Услуги' : 'Общие'),
    },
    { key: 'question', label: 'Вопрос', render: (r) => <strong>{r.question}</strong> },
    { key: 'position', label: 'Порядок' },
  ],
  fields: [
    {
      name: 'section',
      label: 'Раздел',
      type: 'select',
      options: [
        { value: 'general', label: 'Общие' },
        { value: 'services', label: 'Услуги' },
      ],
    },
    { name: 'question', label: 'Вопрос', type: 'textarea', required: true, wide: true },
    { name: 'answer', label: 'Ответ', type: 'textarea', required: true, wide: true },
    { name: 'position', label: 'Порядок', type: 'number', min: 0 },
  ],
}

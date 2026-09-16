import type { Master } from '@/types'

const loc = (district: string): Master['location'] => ({
  address: `${district} район`,
  city: 'Астана',
  lat: 51.169392,
  lng: 71.449074,
  workHours: 'Пн–Сб, 09:00–20:00',
})

const shots = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80',
]

export const masters: Master[] = [
  { id: '1', name: 'Алексей Волков', specialty: ['Сантехника', 'Плитка'], city: 'Астана', district: 'Есильский', rating: 4.9, reviewCount: 42, jobs: 128, rate: 8000, verified: true, available: true, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', bio: 'Санузлы под ключ более 9 лет. Работаю аккуратно, заранее согласую смету и раскладку плитки.', portfolio: shots.slice(0, 4), location: loc('Есильский') },
  { id: '2', name: 'Данияр Нурланов', specialty: ['Электромонтаж'], city: 'Астана', district: 'Алматинский', rating: 4.8, reviewCount: 31, jobs: 94, rate: 6500, verified: true, available: true, image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80', bio: 'Электрик с допуском. Сборка щитов, замена проводки в квартирах и офисах, протоколы замеров.', portfolio: shots.slice(1, 5), location: loc('Алматинский') },
  { id: '3', name: 'Марина Соколова', specialty: ['Малярные работы', 'Декор'], city: 'Астана', district: 'Сарыаркинский', rating: 5, reviewCount: 27, jobs: 76, rate: 5500, verified: true, available: false, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80', bio: 'Покраска стен и потолков без разводов, декоративные штукатурки, подготовка под обои.', portfolio: shots.slice(2, 6), location: loc('Сарыаркинский') },
  { id: '4', name: 'Тимур Ахметов', specialty: ['Отделка', 'Гипсокартон'], city: 'Астана', district: 'Байконурский', rating: 4.7, reviewCount: 19, jobs: 61, rate: 6000, verified: false, available: true, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', bio: 'Короба, ниши и многоуровневые потолки из гипсокартона. Ровная геометрия, чистые углы.', portfolio: shots.slice(0, 3), location: loc('Байконурский') },
  { id: '5', name: 'Ержан Сапаров', specialty: ['Ремонт под ключ', 'Прораб'], city: 'Астана', district: 'Нуринский', rating: 4.9, reviewCount: 38, jobs: 52, rate: 12000, verified: true, available: true, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', bio: 'Веду ремонт квартир под ключ: бригада, график, закупка материалов и отчёты заказчику.', portfolio: shots.slice(1, 5), location: loc('Нуринский') },
  { id: '6', name: 'Айгуль Дюсенова', specialty: ['Плитка', 'Мозаика'], city: 'Астана', district: 'Есильский', rating: 4.8, reviewCount: 22, jobs: 70, rate: 7000, verified: true, available: true, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80', bio: 'Крупноформат, мозаика, сложные раскладки. Подрез в размер, швы 1.5 мм.', portfolio: shots.slice(2, 5), location: loc('Есильский') },
  { id: '7', name: 'Владимир Ким', specialty: ['Сантехника', 'Отопление'], city: 'Астана', district: 'Алматинский', rating: 4.6, reviewCount: 17, jobs: 48, rate: 6500, verified: false, available: true, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', bio: 'Разводка водопровода и канализации, полотенцесушители, установка бойлеров и фильтров.', portfolio: shots.slice(0, 3), location: loc('Алматинский') },
  { id: '8', name: 'Асель Кабенова', specialty: ['Дизайн', 'Отделка'], city: 'Астана', district: 'Алматинский', rating: 4.9, reviewCount: 25, jobs: 40, rate: 9000, verified: true, available: false, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80', bio: 'Дизайн-проект и авторский надзор. Подбор материалов, чертежи, ведомости отделки.', portfolio: shots.slice(1, 4), location: loc('Алматинский') },
  { id: '9', name: 'Нурлан Исмаилов', specialty: ['Полы', 'Стяжка'], city: 'Астана', district: 'Есильский', rating: 4.7, reviewCount: 14, jobs: 55, rate: 5800, verified: true, available: true, image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80', bio: 'Полусухая стяжка, наливные полы, укладка ламината и кварц-винила. Контроль уровня по маякам.', portfolio: shots.slice(2, 6), location: loc('Есильский') },
  { id: '10', name: 'Дмитрий Орлов', specialty: ['Электромонтаж', 'Слаботочка'], city: 'Астана', district: 'Сарыаркинский', rating: 4.8, reviewCount: 20, jobs: 66, rate: 7200, verified: true, available: true, image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80', bio: 'Силовая и слаботочная разводка, умный дом, сети и видеонаблюдение.', portfolio: shots.slice(0, 4), location: loc('Сарыаркинский') },
  { id: '11', name: 'Гульмира Тлеуова', specialty: ['Малярные работы'], city: 'Астана', district: 'Сарыаркинский', rating: 4.6, reviewCount: 12, jobs: 33, rate: 5000, verified: false, available: true, image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=600&q=80', bio: 'Шпаклёвка в ноль, покраска, поклейка обоев любой сложности, включая метровые флизелиновые.', portfolio: shots.slice(1, 4), location: loc('Сарыаркинский') },
  { id: '12', name: 'Бекзат Мукашев', specialty: ['Демонтаж', 'Черновые работы'], city: 'Астана', district: 'Алматинский', rating: 4.5, reviewCount: 16, jobs: 88, rate: 4500, verified: true, available: true, image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80', bio: 'Демонтаж, штробление, вывоз мусора, кладка перегородок из газоблока и пеноблока.', portfolio: shots.slice(2, 5), location: loc('Алматинский') },
]

export const findMaster = (id: string) => masters.find((m) => m.id === id)

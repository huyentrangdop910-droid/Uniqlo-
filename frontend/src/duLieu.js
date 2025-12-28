// frontend/src/duLieu.js

// DỮ LIỆU BỘ SƯU TẬP (Lấy từ HomePage.jsx của bạn)
import img1 from './assets/images/vngoods_02_478849_3x4.avif';
import img2 from './assets/images/vngoods_09_470173_3x4.avif';
import img3 from './assets/images/vngoods_09_479767_3x4.avif';
import img4 from './assets/images/vngoods_30_478528_3x4.avif';
import img5 from './assets/images/vngoods_33_478848_3x4.avif';
import img6 from './assets/images/vngoods_36_483301_3x4.avif';
import img7 from './assets/images/vngoods_37_478861_3x4.avif';
import img8 from './assets/images/vngoods_58_479619_3x4.avif';
import img9 from './assets/images/vngoods_66_481486_3x4.avif';
export const MOCK_COLLECTIONS = [
  {
    id: 1,
    title: 'Bộ Sưu Tập Mùa Đông 2025',
    description: 'Mềm mại,ấm áp từ chất vải .',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/resc5256761431e0cb062c36f31cd945c68fr.jpg'
  },
  {
    id: 2,
    title: 'Bộ Sưu Tập Áo Khoác',
    description: 'Dáng ngắn với chi tiết cổ áo thanh lịch.',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/res0081881b3a12ec22be696b9148dad1ecfr.jpg'
  },
  // ... (Tất cả các bộ sưu tập khác của bạn)
   {
    id: 3,
    title: 'Trang Phục Len Thu Đông',
    description: 'Trang phục len chất lượng,phù hợp mọi phong cách .',
    price: '799.000 VND',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/rese9d47ca16e1322d2937552c236fbe30cfr.jpg'
  },
  {
    id: 4,
    title: 'Bộ Sưu Tập Quần Ống Rộng',
    description: 'Tận hưởng phong cách mùa mới.',
    price: '899.000 VND',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/res0dc674dbd250989fc75d771379069695fr.jpg'
  },
  {
    id: 5,
    title: 'Bộ Sưu Tập Áo Thun',
    description: 'Chiếc áo thun lý tưởng không thể thiếu trong tủ đồ của bạn.',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/rese447c329253074deed18b8cbaaccd861fr.jpg'
  },
  {
    id: 6,
    title: 'Bộ Sưu Tập Vải Lanh',
    description: 'Chất liệu tự nhiên,thân thiện.',
    price: '588.000 VND',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/res4105bc0ba3dcc9266a5f7c1285beb483fr.jpg'
  },
  {
    id: 7,
    title: 'Jean Siêu Co Giãn',
    description: 'Thoải mái trong mọi chuyển động.',
    price: '499.000 VND',
    imageUrl: 'https://bupbes.com/cdn/shop/files/c_4b294573-524f-4bdc-9e90-92926a5389a8.jpg?v=1751126482&width=3000'
  },
  {
    id: 8,
    title: 'Bộ Sưu Tập Chân Váy',
    description: 'Dịu dàng và nữ tính hơn.',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/res9e17909644782ee52fd0d906f9800d9ffr.jpg'
  },
  {
    id: 9,
    title: 'Bộ Sưu Tập Trang Phục Nỉ',
    description: 'Đa dạng kiểu dáng,phù hợp với mọi dáng người.',
    price: '799.000 VND',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/resc526240e6c660019392368dfcd02eb80fr.jpg'
  },
  {
    id: 10,
    title: 'Bộ Sưu Tập Áo Sơ Mi',
    description: 'Đa dạng lựa chọn về màu sắc và kiểu dáng.',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/res3d859c8cecfe15facedff6c372435c14fr.jpg?1759225441007'
  }
];
/*export const MOCK_PRODUCTS = [
  {
    id: 201,
    collectionId: 1,
    name: 'Áo Khoác Trần Bông Dáng Dài',
    price: '784.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
    imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/479209/item/vngoods_39_479209_3x4.jpg?width=294', // Đã có
   //imageUrl: img1,
    colors: ['#383B3C', '#D1C8C0', '#180930ff']
  },
  {
    id: 202,
    collectionId: 1,
    name: 'Áo Khoác Lông Vũ Dáng Ngắn',
    price: '984.000 VND',
    sizes: 'S-L', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
   imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/478578001/item/vngoods_07_478578001_3x4.jpg?width=294', // Đã có
   // imageUrl: img2,
    colors: ['#383B3C', '#D1C8C0', '#77353C']
  },
  {
    id: 203,
    collectionId: 1,
    name: 'Sanrio Characters Áo Thun',
    price: '584.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
   imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/484470/item/vngoods_41_484470_3x4.jpg?width=294', // Đã có
    //imageUrl: img3,
    colors: ['#383B3C', '#D1C8C0', '#b9c41fff']
  },
  {
    id: 204,
    collectionId: 1,
    name: 'Áo thun hoạ tiết',
    price: '784.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
    imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/484469/item/vngoods_03_484469_3x4.jpg?width=294', // Đã có
    //imageUrl: img4,
    colors: [ '#D1C8C0',]
  },
  {
    id: 205,
    collectionId: 1,
    name: 'Áo Cardigan Len Nữ',
    price: '686.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
  imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/478336/item/vngoods_07_478336_3x4.jpg?width=294', // Đã có
   // imageUrl: img5,
    colors: ['#383B3C', '#D1C8C0',]
  },
  {
    id: 206,
    collectionId: 1,
    name: 'Áo Len Cổ Tròn Hoạ Tiết',
    price: '999.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
   // imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/482645/item/vngoods_03_482645_3x4.jpg?width=294', // Đã có
    imageUrl: img6,
    colors: ['#383B3C', '#fffbf8ff', '#c1b2b3ff']
  },
  {
    id: 207,
    collectionId: 1,
    name: 'Áo Sơ Mi Vải Dạ',
    price: '884.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
 imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/479086/item/vngoods_65_479086_3x4.jpg?width=294', // Đã có
    //imageUrl: img7,
    colors: ['#383B3C', '#D1C8C0', '#171b47ff']
  },
  {
    id: 208,
    collectionId: 1,
    name: 'Quần Jean Ống Rộng',
    price: '784.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
  imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/480740/item/vngoods_67_480740_3x4.jpg?width=294', // Đã có
    //imageUrl: img8,
    colors: ['#383B3C', '#110f23ff']
  },
  {
    id: 209,
    collectionId: 1,
    name: 'Quần Dài Ống Suông Nữ',
    price: '984.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
  imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/475344/item/vngoods_69_475344_3x4.jpg?width=294', // Đã có
   // imageUrl: img9,
    colors: ['#383B3C', '#D1C8C0', '#9a2733ff']
  },
  {
    id: 210,
    collectionId: 1,
    name: 'Chân Váy Vải Saffon Xếp Tàng',
    price: '484.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
  imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/480810/item/vngoods_57_480810_3x4.jpg?width=294', // Đã có
   // imageUrl: img9,
    colors: ['#383B3C', '#D1C8C0', '#dbb2b6ff']
  },
  {
    id: 211,
    collectionId: 1,
    name: 'Quần Váy',
    price: '684.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
  imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/479662/item/vngoods_09_479662_3x4.jpg?width=294', // Đã có
   // imageUrl: img9,
    colors: ['#383B3C', '#D1C8C0', '#844b17ff']
  },
  {
    id: 212,
    collectionId: 1,
    name: 'Quần Sort',
    price: '984.000 VND',
    sizes: 'XS-XL', // Đã thêm
    rating: { stars: 4.8, count: 102 }, // Đã thêm
  imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/473698/item/vngoods_31_473698_3x4.jpg?width=294', // Đã có
   //imageUrl: img9,
    colors: ['#383B3C', '#D1C8C0', '#696969ff']
  },

  // ... (Tự copy/paste thêm 6 sản phẩm còn lại của ID 1) ...
];*/

// Du lieu menu
export const MENU_CATEGORIES = [
  { name: 'Hàng Mới Về', icon: 'Newspaper' },
  { name: 'Extra Size', icon: 'Ruler' },
  { name: 'Khuyến Mãi Có Hạn', icon: 'Percent' },
  { name: 'Áo', icon: 'Shirt' },
  { name: 'Quần', icon: 'Redo' }, // Dùng Redo làm icon placeholder cho Quần
  { name: 'Váy Đầm', icon: 'Gift' }, // Dùng Gift làm icon placeholder
  { name: 'Đồ Mặc Nhà', icon: 'HomeIcon' },
  { name: 'Phụ Kiện', icon: 'Zap' },
  { name: 'Hàng bán chạy', icon: 'Flame' },
];
/*export const MENU_CATEGORIES = [
  // (Tôi đã ánh xạ các mục menu với ID bộ sưu tập của bạn)
  { id: 1, name: 'Hàng Mới Về', icon: 'Newspaper' }, // -> Bô Sưu Tập Mùa Đông
  { id: 2, name: 'Hàng bán chạy', icon: 'Flame' },   // -> Áo Khoác
  { id: 3, name: 'Extra Size', icon: 'Ruler' },     // -> Trang Phục Len
  { id: 7, name: 'Khuyến Mãi Có Hạn', icon: 'Percent' },// -> Jean
  { id: 5, name: 'Áo', icon: 'Shirt' },             // -> Áo Thun
  { id: 4, name: 'Quần', icon: 'Redo' },            // -> Quần Ống Rộng
  { id: 8, name: 'Váy/Đầm', icon: 'Gift' },         // -> Chân Váy
  { id: 9, name: 'Đồ Mặc Nhà', icon: 'HomeIcon' },  // -> Trang Phục Nỉ
  { id: 6, name: 'Phụ Kiện', icon: 'Zap' },          // -> Vải Lanh
];*/
export const TOPICS_DATA = [
  {
    title: 'WEEKLY RECOMMENDATION',
    description: 'Xem ngay gợi ý mặc đẹp và thoải mái mỗi tuần cùng RENTZY.',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/resf08d10a7807b15d2a4bdd0c23015e3f3fr.jpg'
  },
  {
    title: 'WELCOME COUPON',
    description: 'Tải ứng dụng và đăng ký tài khoản ngay để nhận MÃ GIẢM GIÁ 100.000VND.',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/res95826a5fd77953a38535225cd377845bfr.jpg'
  },
  {
    title: 'Dịch vụ "Nhận Hàng Trong Ngày"',
    description: 'Dịch vụ "Nhận Hàng Trong Ngày" nay đã có mặt. Khám phá ngay!',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/res593e3fd427b8ec39bddd89fc7e026561fr.jpg'
  },
  {
    title: 'MySize ASSIST CAMERA',
    description: 'Tính năng mới giúp bạn tìm kiếm kích cỡ phù hợp!',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/resc7daece9045395ef5d7891a890689b8dfr.jpg'
  },
  {
    title: 'Thẻ Quà Tặng RENTZY',
    description: 'Món quà hoàn hảo cho mọi dịp.',
    imageUrl: 'https://im.uniqlo.com/global-cms/spa/resc7ee7a2066b9425521633e31f1942a5ffr.jpg'
  },
];


///////
export const MOCK_PRODUCTS = [
  {
    id: 201,
    collectionId: 1,
    name: 'Áo Sơ Mi',
    price: '784.000 VND',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://images.unsplash.com/photo-1562657916-d8ce834d5f50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGNvdHRvbiUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',],
    colors: 
       [
        { name: 'BLACK', code: '#383B3C' }, 
        { name: 'BEIGE', code: '#D1C8C0' },
        { name: 'NAVY', code: '#180930ff' }
    ],
        
        
    
    description: 'Một chiếc áo khoác parka có đệm nhẹ và ấm áp. Lớp phủ chống thấm nước bền bỉ.',
    details: 'Vải mặt: 100% Nylon. Lớp lót: 100% Polyester.'
  },
  {
    id: 202,
    collectionId: 1,
    name: 'Áo Khoác Lông Vũ Dáng Ngắn',
    price: '984.000 VND',
    sizes: ['S', 'M', 'L'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://plus.unsplash.com/premium_photo-1674718917175-70e7062732e5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG93biUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',],
    colors: [
        { name: 'DARK BROWN', code: '#383B3C' }, 
        { name: 'BEIGE', code: '#D1C8C0' },
        { name: 'RED', code: '#77353C' }
    ],
    description: 'Áo khoác dáng ngắn sành điệu. Thiết kế đa năng phù hợp với mọi trang phục.',
    details: 'Vải mặt: 100% Nylon. Lớp lót: 100% Polyester.'
  },
  {
    id: 203,
    collectionId: 1,
    name: 'Sanrio Characters Áo Thun',
    price: '584.000 VND',
    sizes: ['XS', 'S', 'M', 'L'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHQlMjBzaGlydCUyMG1vY2t1cHxlbnwwfHwwfHx8MA%3D%3D'
    ],
    colors: [
        { name: 'WHITE', code: '#FFFFFF' }, 
        { name: 'YELLOW', code: '#b9c41fff' }
    ],
    description: 'Bộ sưu tập Sanrio Characters dễ thương và đáng yêu.',
    details: '100% Cotton.'
  },
  {
    id: 204,
    collectionId: 1,
    name: 'Áo thun hoạ tiết',
    price: '784.000 VND',
    sizes: ['XS', 'S', 'M'],
    rating: { stars: 4.8, count: 102 },
    imageUrls:[ 'https://images.unsplash.com/photo-1660774986940-7ceeea68158f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fHQlMjBzaGlydCUyMG1vY2t1cHxlbnwwfHwwfHx8MA%3D%3D',],
    colors: [{ name: 'BEIGE', code: '#D1C8C0' }],
    description: 'Mô tả...', details: '...'
  },
  {
    id: 205,
    collectionId: 1,
    name: 'Áo Cardigan Len Nữ',
    price: '686.000 VND',
    sizes: ['M', 'L', 'XL'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://plus.unsplash.com/premium_photo-1755958633133-851730374ac0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q2xvdGhpbmclMjBmbGF0JTIwbGF5fGVufDB8fDB8fHww',],
    colors: [{ name: 'DARK BROWN', code: '#383B3C' }, { name: 'BEIGE', code: '#D1C8C0' }],
    description: 'Mô tả...', details: '...'
  },
  {
    id: 206,
    collectionId: 1,
    name: 'Áo Len Cổ Tròn Hoạ Tiết',
    price: '999.000 VND',
    sizes: ['S', 'M'],
    rating: { stars: 4.8, count: 102 },
    imageUrls:[ 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/482645/item/vngoods_03_482645_3x4.jpg?width=294',],
    colors: [{ name: 'DARK GRAY', code: '#383B3C' }, { name: 'WHITE', code: '#fffbf8ff' }, { name: 'PINK', code: '#c1b2b3ff' }],
    description: 'Mô tả...', details: '...'
  },
  {
    id: 207,
    collectionId: 1,
    name: 'Áo Sơ Mi Vải Dạ',
    price: '884.000 VND',
    sizes: ['XS', 'S', 'L'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/479086/item/vngoods_65_479086_3x4.jpg?width=294',],
    colors: [{ name: 'BLUE', code: '#171b47ff' }],
    description: 'Mô tả...', details: '...'
  },
  {
    id: 208,
    collectionId: 1,
    name: 'Quần Jean Ống Rộng',
    price: '784.000 VND',
    sizes: ['M', 'L'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://images.unsplash.com/photo-1604176354204-9268737828e4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SmVhbnN8ZW58MHx8MHx8fDA%3D',],
    colors: [{ name: 'DARK BLUE', code: '#110f23ff' }],
    description: 'Mô tả...', details: '...'
  },
  {
    id: 209,
    collectionId: 1,
    name: 'Quần Dài Ống Suông Nữ',
    price: '984.000 VND',
    sizes: ['XS', 'S', 'M', 'L'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://images.unsplash.com/photo-1637069585336-827b298fe84a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SmVhbnN8ZW58MHx8MHx8fDA%3D',],
    colors: [{ name: 'BLACK', code: '#383B3C' }, { name: 'BEIGE', code: '#D1C8C0' }, { name: 'RED', code: '#9a2733ff' }],
    description: 'Mô tả...', details: '...'
  },
  {
    id: 210,
    collectionId: 1,
    name: 'Chân Váy Vải Saffon Xếp Tầng',
    price: '484.000 VND',
    sizes: ['XS', 'S', 'M'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D'
    ],
    colors: [{ name: 'PINK', code: '#dbb2b6ff' }],
    description: 'Mô tả...', details: '...'
  },
  {
    id: 211,
    collectionId: 1,
    name: 'Quần Váy',
    price: '684.000 VND',
    sizes: ['L', 'XL'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://plus.unsplash.com/premium_photo-1673367751771-f13597abadf3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U2tpcnR8ZW58MHx8MHx8fDA%3D',],
    colors: [{ name: 'BROWN', code: '#844b17ff' }],
    description: 'Mô tả...', details: '...'
  },
  {
    id: 212,
    collectionId: 1,
    name: 'Quần Sort',
    price: '984.000 VND',
    sizes: ['XS', 'M', 'L'],
    rating: { stars: 4.8, count: 102 },
    imageUrls: ['https://images.unsplash.com/photo-1651694558313-fdfc4ee862ba?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcnQlMjBqZWFuc3xlbnwwfHwwfHx8MA%3D%3D',],
    colors: [{ name: 'GRAY', code: '#696969ff' }],
    description: 'Mô tả...', details: '...'
  },
];
// Block library definitions, schema, and default props

const L = (en, th) => ({ en, th });

export const BLOCK_LIBRARY = [
  { kind: 'header',    label: L('Email Banner', 'แบนเนอร์อีเมล'),        group: 'essentials' },
  { kind: 'hero',      label: L('Hero', 'ภาพหลัก'),                      group: 'essentials' },
  { kind: 'text',      label: L('Heading + Text', 'หัวข้อ + เนื้อหา'),  group: 'essentials' },
  { kind: 'image',     label: L('Image', 'รูปภาพ'),                      group: 'media' },
  { kind: 'letter',    label: L('Letter', 'จดหมายข้อความ'),              group: 'media' },
  { kind: 'gallery',   label: L('Image Gallery', 'แกลเลอรี'),            group: 'media' },
  { kind: 'video',     label: L('Video', 'วิดีโอ'),                      group: 'media' },
  { kind: 'podcast',   label: L('Podcast', 'พ็อดแคสต์'),                 group: 'media' },
  { kind: 'language',  label: L('Language Switcher', 'ตัวเลือกภาษา'),    group: 'elements' },
  { kind: 'twocol',    label: L('Two Columns', 'สองคอลัมน์'),            group: 'layout' },
  { kind: 'threecol',  label: L('Three Columns', 'สามคอลัมน์'),          group: 'layout' },
  { kind: 'storylist', label: L('Story List', 'รายการเรื่อง'),           group: 'layout' },
  { kind: 'button',    label: L('Button / CTA', 'ปุ่มกระทำ'),            group: 'elements' },
  { kind: 'divider',   label: L('Divider', 'เส้นคั่น'),                  group: 'elements' },
  { kind: 'quote',     label: L('Pull Quote', 'คำพูดอ้างอิง'),           group: 'elements' },
  { kind: 'mediaform', label: L('Media Form', 'แบบฟอร์มสื่อ'),           group: 'elements' },
  { kind: 'footer',    label: L('Footer', 'ส่วนท้าย'),                   group: 'essentials' },
];

export const BLOCK_GROUPS = [
  { id: 'essentials', label: L('Essentials', 'พื้นฐาน') },
  { id: 'media',      label: L('Media', 'สื่อ') },
  { id: 'layout',     label: L('Layouts', 'เลย์เอาต์') },
  { id: 'elements',   label: L('Elements', 'องค์ประกอบ') },
];

export const DEFAULT_PROPS = {
  header: {
    img: '', alt: 'Email banner', href: '',
    headline: 'A passion for impossible discovery',
    fontSize: 26, bgColor: '#FFF7F5', flipped: false, showLogo: true,
    imgX: 50, imgY: 50,
  },
  hero: {
    eyebrow: 'Q2 Town Hall',
    title: 'Hi {{first_name}}, here\'s what\'s next at Roche',
    copy: 'A look at the science, the partnerships and the people driving us forward this quarter.',
    cta: 'Read full update',
    img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    img_h: 300,
  },
  text: {
    heading: 'Innovating for patients',
    copy: 'We unite leading science and technology across diagnostics and pharmaceuticals to prevent, stop and cure diseases.\n\nOur pipeline continues to advance in areas of significant unmet need — and your work makes that possible.',
    bg_color: '', bg_img: '', bg_scale: 100, bg_pos: 'center center',
  },
  letter: {
    html: '<p>Dear team,</p><p>This is a <strong>rich-text letter block</strong>. Use the toolbar to make text <em>italic</em>, <strong>bold</strong>, or <span style="color:#0066cc">colored</span>.</p><p>Sincerely,<br/>Roche Communications</p>',
    align: 'left',
  },
  image: {
    img: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&q=80',
    caption: 'Roche Penzberg · April 2026', img_w: 100, img_h: 260,
  },
  gallery: {
    img1: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    img2: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    img3: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80',
    img1_h: 140, img2_h: 140, img3_h: 140,
  },
  twocol: {
    a_img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    a_title: 'Annual Report 2025', a_copy: 'Combined strengths in Diagnostics and Pharmaceuticals delivered real progress.', a_cta: 'Read more →', a_href: 'https://roche.com', a_img_h: 140,
    b_img: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80',
    b_title: 'Q1 2026 results', b_copy: 'Strong sales growth of +6% at constant exchange rates this quarter.', b_cta: 'Investor briefing →', b_href: 'https://roche.com', b_img_h: 140,
  },
  threecol: {
    a_img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80', a_title: 'Pipeline', a_copy: '28 approved medicines in 2025.', a_cta: 'Learn more →', a_href: 'https://roche.com',
    b_img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80', b_title: 'People', b_copy: '100k+ Roche colleagues worldwide.', b_cta: 'Learn more →', b_href: 'https://roche.com',
    c_img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80', c_title: 'Patients', c_copy: 'Reaching more communities than ever.', c_cta: 'Learn more →', c_href: 'https://roche.com',
    img_h: 110,
  },
  storylist: {
    count: 3,
    s1_img: '', s1_title: 'Q1 2026 results', s1_copy: 'Strong sales growth of +6% at constant exchange rates this quarter.', s1_cta: 'Read more →', s1_href: 'https://roche.com',
    s2_img: '', s2_title: 'Annual Report 2025', s2_copy: 'Combined strengths in Diagnostics and Pharmaceuticals delivered real progress.', s2_cta: 'Read more →', s2_href: 'https://roche.com',
    s3_img: '', s3_title: 'People & Culture update', s3_copy: 'Reaching more communities and colleagues than ever before.', s3_cta: 'Read more →', s3_href: 'https://roche.com',
    img_h: 160,
  },
  button: { label: 'Read more', href: 'https://roche.com', align: 'center' },
  divider: {},
  quote: {
    text: 'Our pipeline continues to advance in areas where patients face significant unmet need.',
    attrib: 'Thomas Schinecker, CEO', width: 100,
  },
  video: {
    thumb: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80',
    href: 'https://roche.com/video', caption: 'Watch · 2 min — Behind the science of Itovebi',
  },
  podcast: {
    show: 'The Roche Beat', episode: 'Ep. 14 — The future of personalised oncology',
    host: 'Hosted by Dr. Maya Lindberg with Dr. Aaron Park', duration: '32 min',
    artwork: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80',
    href: 'https://roche.com/podcast',
  },
  language: {
    note: 'Email sent to all employees in scope of GEOS',
    prompt: 'Read this message in your preferred language',
    examples: 'For example:',
    languages: 'auf Deutsch | 中文 | em português | en français | en español',
  },
  mediaform: {
    title: 'Media Registration', submit_label: 'Submit',
    show_name: true, show_surname: true, show_position: true, show_org: true,
    show_email: true, show_medid: true, show_chk1: true, show_chk2: true,
  },
  footer: {
    address: 'F. Hoffmann-La Roche Ltd · Grenzacherstrasse 124 · 4070 Basel, Switzerland',
    links: 'Contact · Privacy notice · Unsubscribe',
    legal: 'You\'re receiving this because you opted in to Roche internal updates. © 2026 F. Hoffmann-La Roche Ltd.',
  },
};

export const FIELDS = {
  header: [
    ['headline', L('Headline', 'หัวข้อ'), 'text'],
    ['fontSize', L('Font size', 'ขนาดตัวอักษร'), 'slider', { min: 14, max: 40, step: 1, suffix: 'px' }],
    ['bgColor', L('Background', 'สีพื้นหลัง'), 'swatches', [
      { value: '#FFF7F5', label: 'Soft pink' },
      { value: '#DBD6D1', label: 'Stone' },
      { value: '#BDE3FF', label: 'Sky' },
      { value: '#FFFFFF', label: 'White' },
      { value: '#F0D9EA', label: 'Lilac' },
    ]],
    ['img', L('Right image', 'รูปขวา'), 'image'],
    ['flipped', L('Flip: image on left', 'สลับด้าน'), 'toggle'],
    ['showLogo', L('Show Roche logo', 'แสดงโลโก้'), 'toggle'],
  ],
  hero: [
    ['eyebrow', L('Eyebrow', 'หัวเรื่องย่อย'), 'text'],
    ['title', L('Headline', 'หัวข้อหลัก'), 'textarea'],
    ['copy', L('Body copy', 'เนื้อหา'), 'textarea'],
    ['cta', L('Button label', 'ป้ายปุ่ม'), 'text'],
    ['img', L('Image', 'รูป'), 'image'],
    ['img_h', L('Image height', 'ความสูงรูป'), 'slider', { min: 100, max: 600, step: 10, suffix: 'px' }],
  ],
  text: [
    ['heading', L('Heading', 'หัวข้อ'), 'text'],
    ['copy', L('Body copy', 'เนื้อหา'), 'textarea'],
    ['bg_color', L('Background color', 'สีพื้นหลัง'), 'swatches', [
      { value: '', label: 'None' },
      { value: '#FFFFFF', label: 'White' },
      { value: '#F5F5F5', label: 'Light grey' },
      { value: '#0066CC', label: 'Blue' },
      { value: '#003366', label: 'Dark blue' },
      { value: '#1a1a1a', label: 'Black' },
    ]],
    ['bg_img', L('Background image', 'รูปพื้นหลัง'), 'image'],
    ['bg_scale', L('Image scale', 'ขนาดรูป %'), 'slider', { min: 50, max: 300, step: 5, suffix: '%' }],
    ['bg_pos', L('Image position', 'ตำแหน่งรูป'), 'select', { options: [
      ['center center', 'Center'], ['top center', 'Top'], ['bottom center', 'Bottom'],
      ['center left', 'Left'], ['center right', 'Right'],
    ]}],
  ],
  letter: [
    ['align', L('Alignment', 'จัดวาง'), 'select', { options: [['left', 'Left'], ['center', 'Center'], ['right', 'Right']] }],
  ],
  image: [
    ['img', L('Image', 'รูป'), 'image'],
    ['img_w', L('Image width', 'ความกว้างรูป'), 'slider', { min: 30, max: 100, step: 5, suffix: '%' }],
    ['img_h', L('Image height', 'ความสูงรูป'), 'slider', { min: 100, max: 600, step: 10, suffix: 'px' }],
    ['caption', L('Caption', 'คำบรรยาย'), 'text'],
  ],
  gallery: [
    ['img1', L('Image 1', 'รูป 1'), 'image'],
    ['img1_h', L('Image 1 height', 'ความสูง 1'), 'slider', { min: 80, max: 400, step: 10, suffix: 'px' }],
    ['img2', L('Image 2', 'รูป 2'), 'image'],
    ['img2_h', L('Image 2 height', 'ความสูง 2'), 'slider', { min: 80, max: 400, step: 10, suffix: 'px' }],
    ['img3', L('Image 3', 'รูป 3'), 'image'],
    ['img3_h', L('Image 3 height', 'ความสูง 3'), 'slider', { min: 80, max: 400, step: 10, suffix: 'px' }],
  ],
  twocol: [
    ['a_title', L('Card 1 title', 'หัวข้อ 1'), 'text'],
    ['a_copy', L('Card 1 body', 'เนื้อหา 1'), 'textarea'],
    ['a_cta', L('Card 1 link', 'ลิงก์ 1'), 'text'],
    ['a_href', L('Card 1 URL', 'URL 1'), 'url'],
    ['a_img', L('Card 1 image', 'รูป 1'), 'image'],
    ['a_img_h', L('Card 1 image height', 'ความสูง 1'), 'slider', { min: 80, max: 400, step: 10, suffix: 'px' }],
    ['b_title', L('Card 2 title', 'หัวข้อ 2'), 'text'],
    ['b_copy', L('Card 2 body', 'เนื้อหา 2'), 'textarea'],
    ['b_cta', L('Card 2 link', 'ลิงก์ 2'), 'text'],
    ['b_href', L('Card 2 URL', 'URL 2'), 'url'],
    ['b_img', L('Card 2 image', 'รูป 2'), 'image'],
    ['b_img_h', L('Card 2 image height', 'ความสูง 2'), 'slider', { min: 80, max: 400, step: 10, suffix: 'px' }],
  ],
  threecol: [
    ['a_title', L('Col 1 title', 'หัวข้อ 1'), 'text'],
    ['a_copy', L('Col 1 body', 'เนื้อหา 1'), 'textarea'],
    ['a_cta', L('Col 1 link', 'ลิงก์ 1'), 'text'],
    ['a_href', L('Col 1 URL', 'URL 1'), 'url'],
    ['a_img', L('Col 1 image', 'รูป 1'), 'image'],
    ['b_title', L('Col 2 title', 'หัวข้อ 2'), 'text'],
    ['b_copy', L('Col 2 body', 'เนื้อหา 2'), 'textarea'],
    ['b_cta', L('Col 2 link', 'ลิงก์ 2'), 'text'],
    ['b_href', L('Col 2 URL', 'URL 2'), 'url'],
    ['b_img', L('Col 2 image', 'รูป 2'), 'image'],
    ['c_title', L('Col 3 title', 'หัวข้อ 3'), 'text'],
    ['c_copy', L('Col 3 body', 'เนื้อหา 3'), 'textarea'],
    ['c_cta', L('Col 3 link', 'ลิงก์ 3'), 'text'],
    ['c_href', L('Col 3 URL', 'URL 3'), 'url'],
    ['c_img', L('Col 3 image', 'รูป 3'), 'image'],
    ['img_h', L('Image height (all)', 'ความสูงรูป (ทั้งหมด)'), 'slider', { min: 80, max: 300, step: 10, suffix: 'px' }],
  ],
  storylist: [
    ['s1_title', L('Story 1 title', 'หัวข้อ 1'), 'text'],
    ['s1_copy', L('Story 1 body', 'เนื้อหา 1'), 'textarea'],
    ['s1_cta', L('Story 1 link text', 'ลิงก์ 1'), 'text'],
    ['s1_href', L('Story 1 URL', 'URL 1'), 'url'],
    ['s1_img', L('Story 1 image', 'รูป 1'), 'image'],
    ['s2_title', L('Story 2 title', 'หัวข้อ 2'), 'text'],
    ['s2_copy', L('Story 2 body', 'เนื้อหา 2'), 'textarea'],
    ['s2_cta', L('Story 2 link text', 'ลิงก์ 2'), 'text'],
    ['s2_href', L('Story 2 URL', 'URL 2'), 'url'],
    ['s2_img', L('Story 2 image', 'รูป 2'), 'image'],
    ['s3_title', L('Story 3 title', 'หัวข้อ 3'), 'text'],
    ['s3_copy', L('Story 3 body', 'เนื้อหา 3'), 'textarea'],
    ['s3_cta', L('Story 3 link text', 'ลิงก์ 3'), 'text'],
    ['s3_href', L('Story 3 URL', 'URL 3'), 'url'],
    ['s3_img', L('Story 3 image', 'รูป 3'), 'image'],
    ['img_h', L('Image height (all)', 'ความสูงรูป'), 'slider', { min: 80, max: 300, step: 10, suffix: 'px' }],
    ['count', L('Number of stories', 'จำนวนเรื่อง'), 'slider', { min: 1, max: 6, step: 1, suffix: '' }],
  ],
  button: [
    ['label', L('Button label', 'ป้ายปุ่ม'), 'text'],
    ['href', L('Link URL', 'ลิงก์'), 'url'],
    ['align', L('Alignment', 'การจัดวาง'), 'select', { options: [['left', 'Left'], ['center', 'Center'], ['right', 'Right']] }],
  ],
  divider: [],
  quote: [
    ['text', L('Quote', 'ข้อความ'), 'textarea'],
    ['attrib', L('Attribution', 'ผู้กล่าว'), 'text'],
    ['width', L('Width', 'ความกว้าง'), 'slider', { min: 40, max: 100, step: 5, suffix: '%' }],
  ],
  video: [
    ['thumb', L('Thumbnail', 'รูปย่อ'), 'image'],
    ['href', L('Video link', 'ลิงก์วิดีโอ'), 'url'],
    ['caption', L('Caption', 'คำบรรยาย'), 'text'],
  ],
  podcast: [
    ['artwork', L('Episode artwork', 'รูปตอน'), 'image'],
    ['show', L('Show title', 'ชื่อรายการ'), 'text'],
    ['episode', L('Episode title', 'ชื่อตอน'), 'text'],
    ['host', L('Host / guests', 'ผู้ดำเนินรายการ'), 'text'],
    ['duration', L('Duration', 'ความยาว'), 'text'],
    ['href', L('Listen link', 'ลิงก์ฟัง'), 'url'],
  ],
  language: [
    ['note', L('Audience note', 'หมายเหตุผู้รับ'), 'text'],
    ['prompt', L('Language prompt', 'ข้อความชี้ชวน'), 'text'],
    ['examples', L('Examples label', 'ป้ายตัวอย่าง'), 'text'],
    ['languages', L('Languages (separated by |)', 'ภาษาต่างๆ (คั่นด้วย |)'), 'text'],
  ],
  mediaform: [
    ['title', L('Form title', 'ชื่อฟอร์ม'), 'text'],
    ['submit_label', L('Submit label', 'ป้ายส่ง'), 'text'],
    ['show_name',     L('Name field', 'ชื่อ'),                    'toggle'],
    ['show_surname',  L('Surname field', 'นามสกุล'),              'toggle'],
    ['show_position', L('Position/Specialty', 'ตำแหน่ง'),         'toggle'],
    ['show_org',      L('Organization', 'องค์กร'),                'toggle'],
    ['show_email',    L('Email field', 'อีเมล'),                  'toggle'],
    ['show_medid',    L('Medical Technician ID', 'รหัสนักเทคนิค'), 'toggle'],
    ['show_chk1',     L('Checkbox 1 (receive info)', 'ช่องรับข้อมูล'), 'toggle'],
    ['show_chk2',     L('Checkbox 2 (consent)', 'ช่องยินยอม'),    'toggle'],
  ],
  footer: [
    ['address', L('Address', 'ที่อยู่'), 'text'],
    ['links', L('Links row', 'ลิงก์ส่วนท้าย'), 'text'],
    ['legal', L('Legal / disclaimer', 'ข้อความตามกฎหมาย'), 'textarea'],
  ],
};

export function blockLabel(kind) {
  const e = BLOCK_LIBRARY.find(b => b.kind === kind);
  return e ? e.label : { en: kind, th: kind };
}

export function newBlock(kind) {
  return {
    id: 'b' + Math.random().toString(36).slice(2, 8),
    kind,
    props: structuredClone(DEFAULT_PROPS[kind] || {}),
  };
}

const categories = [
  { slug: 'tees', name: 'Tees', genders: ['men', 'women'], description: 'Heavyweight cotton basics.' },
  { slug: 'hoodies', name: 'Hoodies', genders: ['men', 'women'], description: 'Heavyweight fleece.' },
  { slug: 'jackets', name: 'Jackets', genders: ['men', 'women'], description: 'Leather and outerwear.' },
  { slug: 'dresses', name: 'Dresses', genders: ['women'], description: 'Fluid, structured silhouettes.' },
];

export const collections = [
  {
    slug: 'men',
    name: 'Men',
    tagline: 'Built for gravity.',
    description: 'Technical layers, heavyweight basics and sculptural outerwear.',
    palette: ['#0b0b0f', '#ff5a1f'],
  },
  {
    slug: 'women',
    name: 'Women',
    tagline: 'Light, refracted.',
    description: 'Fluid satins, holographic weaves and cropped silhouettes.',
    palette: ['#1b1030', '#c9b6ff'],
  },
];

export default categories;

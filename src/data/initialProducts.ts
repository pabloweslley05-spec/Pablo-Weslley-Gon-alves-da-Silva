import { ProductModel } from '../types';

export const INITIAL_PRODUCTS: ProductModel[] = [
  {
    id: 'prod-1',
    name: 'Vestido Ébano Dourado',
    description: 'Vestido de alta costura confeccionado em crepe de seda preta pura, adornado com luxuosos ramos bordados à mão em fios metálicos de ouro 24k. Apresenta uma fenda dramática esculpida, caimento fluido extraordinário e decote refinado.',
    price: 4500,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    category: 'Vestidos'
  },
  {
    id: 'prod-2',
    name: 'Costume Império Noir',
    description: 'Conjunto de alta alfaiataria sob medida. Paletó estruturado com lapela peaked em cetim duchesse italiano preto absoluto e calças com corte elegante de alfaiataria clássica. Alinhamento confortável de luxo.',
    price: 5800,
    stock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    category: 'Ternos'
  },
  {
    id: 'prod-3',
    name: 'Scarpin Aureum 85',
    description: 'Salto alto de bico fino luxuoso de couro texturizado nobre metalizado em tom ouro dourado radiante. Sola em couro legítimo polido com detalhe de plaqueta assinatura dourada e forro interno ultra macio.',
    price: 2900,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    category: 'Sapatos'
  },
  {
    id: 'prod-4',
    name: 'Manteau Cashmere रानी (Rani)',
    description: 'Sobretudo de corte reto clássico em cashmere e lã de alpaca de primeiríssima qualidade, matizado em cor marfim pérola. Abotoamento duplo sofisticado com botões de metal maciço banhados a ouro polido.',
    price: 7200,
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    category: 'Sobretudos'
  },
  {
    id: 'prod-5',
    name: 'Clutch Escultórica Raniere',
    description: 'Bolsa carteira estruturada rígida preta, projetada em linhas geométricas art déco. Fecho em metal refinado fundido no padrão filigrana banhado a ouro, com alça fina clássica de corrente de elos entrelaçados para uso no ombro.',
    price: 3400,
    stock: 6,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    category: 'Acessórios'
  }
];


import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // ENTRADAS & GRELHADOS
  { id: '1', name: 'Frango à Passarinho', price: 3500, category: 'Grelhados', description: 'Porção crocante temperada com alho e ervas finas.' },
  { id: '2', name: 'Asinha BBQ', price: 5000, category: 'Grelhados', description: 'Grelhadas lentamente com nosso molho barbecue artesanal.', popular: true },
  { id: '3', name: 'Asinha Sweet Chilli', price: 5000, category: 'Grelhados', description: 'Toque picante e adocicado para paladares exigentes.' },
  { id: '4', name: 'Meio Frango no Churrasco', price: 6000, category: 'Grelhados', description: 'Meia porção do nosso clássico frango na brasa.' },
  { id: '5', name: 'Frango Inteiro no Churrasco', price: 11500, category: 'Grelhados', popular: true, description: 'O rei da casa. Frango inteiro suculento e perfeitamente grelhado.' },

  // PRATOS ESPECIAIS
  { id: '6', name: 'Frango Composto', description: 'Servido com arroz soltinho, feijão preto e batata frita crocante.', price: 10000, category: 'Especiais', popular: true },
  { id: '7', name: 'Bitoque de Frango', description: 'Bife de frango grelhado na hora, servido com ovo estrelado.', price: 9500, category: 'Especiais' },
  { id: '8', name: 'Bitoque', description: 'Bife da vazia grelhado com ovo e guarnição completa.', price: 13000, category: 'Especiais' },
  { id: '9', name: 'Costela / Entrecosto', description: 'Grelhado na brasa com nosso exclusivo molho de especiarias.', price: 6500, category: 'Especiais' },

  // PEIXES GRELHADOS
  { id: '10', name: 'Peixe Grelhado', description: 'Tarapau ou Croaker fresco, temperado com limão e sal grosso.', price: 7000, category: 'Peixes' },
  { id: '11', name: 'Peixe Composto', description: 'Peixe fresco servido com legumes ao vapor, ovo e salada.', price: 9500, category: 'Peixes' },

  // HAMBÚRGUERES
  { id: '12', name: 'Hambúrguer de Frango', description: 'Pão brioche, carne de frango grelhada, alface, tomate e batata frita.', price: 4000, category: 'Hambúrgueres' },
  { id: '13', name: 'Hambúrguer Simples', description: 'Pão premium, carne bovina suculenta e queijo derretido.', price: 4500, category: 'Hambúrgueres' },
  { id: '14', name: 'Salada Simples', description: 'Mix de folhas verdes sazonais e tomates frescos.', price: 5000, category: 'Hambúrgueres' },
  { id: '15', name: 'Salada Caesar', description: 'Folhas frescas, croutons crocantes e molho caesar caseiro.', price: 8000, category: 'Hambúrgueres' },

  // ACOMPANHAMENTOS
  { id: '16', name: 'Arroz Branco', price: 350, category: 'Acompanhamentos' },
  { id: '17', name: 'Arroz de Cenoura', price: 300, category: 'Acompanhamentos' },
  { id: '18', name: 'Feijão Preto', price: 600, category: 'Acompanhamentos' },
  { id: '19', name: 'French Fries', price: 2900, category: 'Acompanhamentos' },
  { id: '20', name: 'Mix de Mandioca', price: 350, category: 'Acompanhamentos' },
  { id: '21', name: 'Feijão de Dendê', price: 500, category: 'Acompanhamentos' },
  { id: '22', name: 'Funje de Milho', price: 400, category: 'Acompanhamentos' },
  { id: '23', name: 'Sopa de Legumes', price: 2100, category: 'Acompanhamentos' },
];

export const GALLERY_IMAGES = [
  'https://i.imgur.com/sMQEEm0.png',
  'https://i.imgur.com/TljVRZK.png',
  'https://i.imgur.com/ww6zEOc.png',
  'https://i.imgur.com/evTK8Ye.png',
  'https://i.imgur.com/AK08Hvp.png',
  'https://i.imgur.com/JAkNUgs.png',
  'https://i.imgur.com/M165ulu.png',
];

export const IMAGES = {
  logo: 'https://imgur.com/gih6kTk.png',
  hero: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=1200',
  secondaryHero: 'https://i.imgur.com/jrfHG9z.png',
};

export const CONTACTS = {
  phone: '932 815 377',
  whatsapp: 'https://wa.me/244932815377',
  instagram: 'https://www.instagram.com/churrasqueira_reis_dos_frangos?igsh=Zjc0NW05ampwOHVm&utm_source=qr',
  location: 'Maianga, Luanda, Angola'
};

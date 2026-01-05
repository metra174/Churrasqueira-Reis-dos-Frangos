
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  popular?: boolean;
}

export type Category = 
  | 'Grelhados' 
  | 'Especiais' 
  | 'Peixes' 
  | 'Hambúrgueres' 
  | 'Acompanhamentos';

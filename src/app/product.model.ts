interface Image {
  _id: string;
  url: string;
  thumbnailUrl: string;
  isMain: boolean;
  meta: {
    fileName: string;
    fileId: string;
    thumbnailFileId: String,
    thumbnailFileName: String
  }
}

interface Category {
  _id: string;
  label: string;
}

interface Product {
  _id: string;
  name?: string;
  price?: number;
  category?: Category;
  desc?: string;
  popular?: boolean;
  sizeInfo?: string;
  materialInfo?: string;
  terms?: string;
  images?: Image[];
}

export default Product;

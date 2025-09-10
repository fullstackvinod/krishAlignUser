export type OrderItem = {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Delivered' | 'In Progress' | 'Cancelled';
  totalAmount: number;
  totalPacks: number;
  category: string;
  image: string;
  deliveryAddress: string;
};

export type RootStackParamList = {
  Language: undefined;
  PhoneNumber: undefined;
  Home: undefined;
  Shop: undefined;
  Orders: undefined;
  Profile: undefined;
  CategoryPlanner: { category: string };
  OrderReview: undefined;
  OrderDetail: { order: OrderItem };
  ComboDetail: { combo: { id: string; name: string; tagline: string; image: string } };
  Cart: undefined;
  LabSamplesList: undefined;
  SampleDetail: {
    sample: {
      id: string;
      cropName: string;
      farmerName: string;
      collectionDate: string;
      status: string;
      statusColor: string;
      location: string;
      testType: string;
      priority: string;
    };
  };
  NewSamples: undefined;
  InProgressSamples: undefined;
};

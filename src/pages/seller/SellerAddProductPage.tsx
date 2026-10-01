import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiListingGenerator } from '../../components/seller/AiListingGenerator';

export const SellerAddProductPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AiListingGenerator
        onProductCreated={() => {
          navigate('/seller/products');
        }}
      />
    </div>
  );
};

import React from 'react';
import CartContainer from '~/containers/CartContainer/CartContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import requestIp from 'request-ip';

interface Props {
  clientIp: string;
}

function Cart(props: Props) {
  return (
    <LayoutContainer>
      <div className="w-full">
        <CartContainer {...props} />
      </div>
    </LayoutContainer>
  );
}

export default Cart;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { req } = context;
    const clientIp = requestIp.getClientIp(req);
    return {
      props: { clientIp },
    };
  },
);

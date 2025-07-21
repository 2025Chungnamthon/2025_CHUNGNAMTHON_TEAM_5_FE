import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 20px 24px;
  margin: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #111;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #f9f9f9;
    transform: translateY(-2px);
  }
`;

const MypageCouponLinkCard = () => <Card>쿠폰 교환하러 가기</Card>;

export default MypageCouponLinkCard;

import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

const MypageCouponLinkCard = ({ onClick, isGuest = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isGuest) {
      if (onClick) {
        onClick();
      } else {
        alert("로그인 후 이용해주세요.");
      }
    } else {
      // 로그인된 사용자는 쿠폰 페이지로 이동
      navigate("/coupon");
    }
  };

  return <Card onClick={handleClick}>쿠폰 교환하러 가기</Card>;
};

export default MypageCouponLinkCard;

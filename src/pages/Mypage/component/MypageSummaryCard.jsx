import React from "react";
import styled from "styled-components";
import { PiTicketFill } from "react-icons/pi";

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin: 0 16px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #888888;
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #222222;
`;

const IconCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ color }) => color || "#eee"};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;
const PointCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #fdd756;
  color: #d18000;
  font-weight: 700;
  font-size: 16px;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
`;
const MypageSummaryCard = ({ point, couponCount }) => (
  <Card>
    <Row>
      <RowLeft>
        <PointCircle>P</PointCircle>
        <Label>포인트</Label>
      </RowLeft>
      <Value>{point.toLocaleString()}p</Value>
    </Row>
    <Row>
      <RowLeft>
        <IconCircle color="#4F8DFD">
          <PiTicketFill color="white" size={18} />
        </IconCircle>
        <Label>쿠폰</Label>
      </RowLeft>
      <Value>{couponCount}장</Value>
    </Row>
  </Card>
);

export default MypageSummaryCard;

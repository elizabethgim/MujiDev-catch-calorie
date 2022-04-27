import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DefaultCelenderChart from './jandi/DefaultCelenderChart.js';
import data from './jandi/data.json';
import * as Api from '../../api';

const JandiContainer = styled.div`
  position: relative;
  width: 1203px;
  height: 387px;
  border-radius: 15px;
  background-color: #94d82d;
  bottom: 10px;
`;

const JandiText = styled.div`
  width: 1203px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.5rem;
  font-weight: bold;
  color: #f03e3e;
`;
const Jandi = () => {
  //   const [data, setData] = useState([]);
  //   useEffect(() => {
  //     Api.get('/jandi').then((res) => {
  //       setData(res.data);
  //     });
  //   }, []);
  return (
    <div>
      <JandiText>HeatMap</JandiText>
      <JandiContainer>
        <DefaultCelenderChart data={data} />
      </JandiContainer>
    </div>
  );
};

export default Jandi;

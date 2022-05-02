import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

import MainButton from './style/MainButton';

import Header from '../Header';
import Footer from '../Footer';

import { useNavigate } from 'react-router-dom';

import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../atoms';

import * as Api from '../../api';

function MainFoodAdd({}) {
  const navigate = useNavigate();

  const user = useRecoilValue(userInfoState);

  const [checked, setChecked] = useState(true);

  const [category, setCategory] = useState();
  const [name, setName] = useState();
  const [kcal, setKcal] = useState();
  const [unit, setUnit] = useState('gram');

  const handleSwitch = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (checked === true) {
      setUnit('gram');
    } else {
      setUnit('pound');
    }
  }, [checked]);

  const handleSubmit = async () => {
    try {
      await Api.post(`foods`, {
        category: category,
        name: name,
        kcal: kcal,
        unit: unit
      });

      alert('Food has been added');
      navigate(`/tracking/${user._id}`, { replace: false });
    } catch (err) {
      alert('Food that already exists');
    }
  };

  return (
    <>
      <Header />
      <div style={{ margin: '100px 80px' }}>
        <h1>Add Food</h1>
        <div style={{ display: 'flex' }}>
          <div>
            <h2>Please enter a category</h2>
            <TextField
              id="outlined-basic"
              label="category"
              variant="outlined"
              inputValue={category}
              onBlur={(e) => setCategory(e.target.value)}
            />
            <h2>Please enter a name</h2>
            <TextField
              id="outlined-basic"
              label="food name"
              variant="outlined"
              inputValue={name}
              onBlur={(e) => setName(e.target.value)}
            />
            <h2>Please enter a kcal</h2>
            <Switch
              checked={checked}
              onChange={handleSwitch}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            {unit}
            <TextField
              id="outlined-basic"
              label="kcal"
              variant="outlined"
              inputValue={kcal}
              onBlur={(e) => setKcal(e.target.value)}
            />
          </div>
        </div>
        <MainButton variant="contained" onClick={handleSubmit}>
          Add
        </MainButton>
      </div>
      <Footer />
    </>
  );
}

export default MainFoodAdd;

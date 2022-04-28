import React, { useState, useEffect, useReducer, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './components/main/Main';
import * as Api from './api';
import { loginReducer } from './reducer';

// import Header from './components/Header';
import LoginForm from './components/user/LoginForm';
import Home from './components/start/Home';
// import Network from './components/user/Network';
import RegisterForm from './components/user/RegisterForm';
import Portfolio from './components/Portfolio';
import MainFoodAdd from './components/main/MainFoodAdd'
import MainExerciseAdd from './components/main/MainExerciseAdd'
import TempStart from './components/user/TempStart';

import Mypage from './components/mypage/Mypage'; // mypage 작업용

// export const UserStateContext = createContext(null);
// export const DispatchContext = createContext(null);

import { useRecoilState } from 'recoil';
import { tokenState, userState } from './atoms';
import UserEditForm from './components/user/UserEditForm';
import UserDelForm from './components/user/UserDelForm';
// export const UserStateContext = createContext(null);
// export const DispatchContext = createContext(null);

function App() {
  // useReducer 훅을 통해 userState 상태와 dispatch함수를 생성함.
  // const [userState, dispatch] = useReducer(loginReducer, {
  //   user: null,
  // });

  // 리코일 적용
  // const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);

  // 아래의 fetchCurrentUser 함수가 실행된 다음에 컴포넌트가 구현되도록 함.
  // 아래 코드를 보면 isFetchCompleted 가 true여야 컴포넌트가 구현됨.
  // const [isFetchCompleted, setIsFetchCompleted] = useState(false);

  // const fetchCurrentUser = async () => {
  //   try {
  //     // 이전에 발급받은 토큰이 있다면, 이를 가지고 유저 정보를 받아옴.
  //     const res = await Api.get('user/current');
  //     const currentUser = res.data;
  //     console.log(currentUser);
  //     // dispatch 함수를 통해 로그인 성공 상태로 만듦.
  //     // dispatch({
  //     //   type: 'LOGIN_SUCCESS',
  //     //   payload: currentUser,
  //     // });
  //     setUser(currentUser);

  //     console.log('%c sessionStorage에 토큰 있음.', 'color: #d93d1a;');
  //   } catch {
  //     console.log('%c SessionStorage에 토큰 없음.', 'color: #d93d1a;');
  //   }
  //   // fetchCurrentUser 과정이 끝났으므로, isFetchCompleted 상태를 true로 바꿔줌
  //   setIsFetchCompleted(true);
  // };

  // // useEffect함수를 통해 fetchCurrentUser 함수를 실행함.
  // useEffect(() => {
  //   fetchCurrentUser();
  // }, []);

  // if (!isFetchCompleted) {
  //   return 'loading...';
  // }

  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/tracking" element={<Portfolio />} />
        <Route path="/tracking/addFood" element={<MainFoodAdd />} />
        <Route path="/tracking/addExercise" element={<MainExerciseAdd />} />
        {/* <Route path="/network" element={<Network />} /> */}

        <Route path="/users" element={<UserEditForm />} />
        <Route path="/users/delete" element={<UserDelForm />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="*" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;

/**
 * Created by tvaisanen on 4/8/17.
 */

import React, {Component} from 'react'
import { Route, NavLink} from 'react-router-dom';

import Blueprint from './components/TabPage';
import Pomodoros from './components/Pomodoros';
import LoginPage from './components/LoginPage';


const routes = [
        {
        path: '/',
        exact: true,
        main: () => <Blueprint/>
    },
    {
        path: '/blueprint',
        exact: true,
        main: () => <Blueprint/>
    },
    {
        path: '/second',
        exact: true,
        main: () => <Pomodoros/>
    },
    {
        path: '/login',
        exact: true,
        main: () => <LoginPage/>
    }
];

export default routes;
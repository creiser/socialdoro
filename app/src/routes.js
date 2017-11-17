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
        props: null,
        exact: true,
        main: () => <Blueprint/>
    },
    {
        path: '/blueprint',
        props: null,
        exact: true,
        main: () => <Blueprint/>
    },
    {
        path: '/second',
        props: null,
        exact: true,
        main: () => <Pomodoros/>
    },
    {
        path: '/login',
        props: null,
        exact: true,
        main: () => <LoginPage/>
    }
];


export default routes;
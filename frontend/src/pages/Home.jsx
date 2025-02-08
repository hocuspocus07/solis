import React, { useState } from 'react';
import NavComp from '../components/NavComp.jsx';
import { Section } from '../components/Section.jsx';
import Review from '../components/Review.jsx';
import Hero from '../components/Hero.jsx';

function Home() {
    return (
        <>
        <div className='custom-bg h-screen w-screen'>
            <NavComp />
            <Hero/>
            <Review/>

        </div>
        <div className='relative z-0'>
                <Section />
            </div></>
    );
}

export default Home;
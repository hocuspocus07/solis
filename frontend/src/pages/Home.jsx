import React, { useState } from 'react';
import NavComp from '../components/NavComp.jsx';
import { Section } from '../components/Section.jsx';
import Review from '../components/Review.jsx';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Dev from '../components/Dev.jsx';
import Footer from '../components/Footer.jsx';

function Home() {
    return (
        <>
        <div className='custom-bg h-screen w-screen'>
            <NavComp />
            <Hero/>
            <Review/>

        </div>

        <div className='about h-screen w-screen'>
            <About />
        </div>

        <div className='dev h-screen w-screen'>
            <Dev />
            <Footer />
        </div>
        </>
    );
}

export default Home;
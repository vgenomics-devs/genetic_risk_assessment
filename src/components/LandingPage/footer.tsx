import React from "react";
import "@/app/globals.css";
import Image from 'next/image';
// import logo from "../../public/white-vgenomics.png";
import LinkList from "@/components/linkLists";
import { mainLinks, bottomLinks } from "../links";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Left Section */}
                <div className="footer-left">
                    <div style={{ marginBottom: "20px" }}>
                        {/* <img src={logo.src} alt="Vgenomics" style={{ height: "40px" }} /> */}
                        <Image src='/white-vgenomics.png' alt="Vgenomics" height={40} width={160} />

                    </div>
                    <p className="footer-tagline">
                        Accelerating Discoveries <br />
                        for Genetic Diseases
                    </p>
                </div>

                {/* Middle Section */}
                <div className="footer-middle">
                    <LinkList links={mainLinks} className='flex flex-col gap-4 footer-middle' />
                </div>

                {/* Right Section */}
                <div className="footer-right">
                    <p>Delhi</p>
                    <p>
                        <a href="mailto:support@vgenomics.co.in">support@vgenomics.co.in</a>
                    </p>
                    <p>0120 4081198</p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <div className="footer-bottom-links">
                    <LinkList links={bottomLinks} separator="|" />
                </div>
                <p style={{ margin: 0, color: "white" }}>
                    Copyright © 2025 Vgenomics | All rights reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;

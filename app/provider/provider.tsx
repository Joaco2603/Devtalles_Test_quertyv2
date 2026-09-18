"use client";

import React from "react";
import { ReactLenis } from "lenis/react";
import { Toaster } from "@/components/ui/toast";

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ReactLenis root>
            <Toaster timeout={2000} limit={3} />
            {children}
        </ReactLenis>
    );
};

export default Provider;
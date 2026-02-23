"use client";

import { useState, useEffect } from "react";
import { companyApi, type CompanyDetails } from "@/lib/api/company";

export function useCompanyData() {
    const [companyData, setCompanyData] = useState<CompanyDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await companyApi.get();
                if (response.success) {
                    setCompanyData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch company data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyData();
    }, []);

    const whatsappNumber = companyData?.whatsappNumber?.replace(/\s+/g, "") || "8503950523";
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    const phoneNumber = companyData?.phone || "+91 85039 50523";
    const email = companyData?.email || "info@chakrabiotech.com";

    return {
        companyData,
        isLoading,
        whatsappNumber,
        whatsappUrl,
        phoneNumber,
        email
    };
}

"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface SearchFilterSidebarProps {
    durationFilter: string;
    setDurationFilter: (value: string) => void;
    priceFilter: string;
    setPriceFilter: (value: string) => void;
    onClearFilters: () => void;
    onClose?: () => void;
    onApply?: () => void;
}

const SearchFilterSidebar: React.FC<SearchFilterSidebarProps> = ({
    durationFilter,
    setDurationFilter,
    priceFilter,
    setPriceFilter,
    onClearFilters,
    onClose,
    onApply,
}) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-6 pb-4 flex-shrink-0 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <h2 className="!text-lg !font-bold !text-slate-900 !uppercase">Filters</h2>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto px-6">
                {/* Duration Filter */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-blue-600 rounded"></div>
                        <Label className="!text-sm !font-bold !text-slate-700 !uppercase !tracking-wider">Duration</Label>
                    </div>
                    <RadioGroup value={durationFilter} onValueChange={(value) => setDurationFilter(value)}>
                        <div className="space-y-2">
                            {[
                                { id: "any", value: "all", label: "Any" },
                                { id: "1-3", value: "1-3", label: "1-3 Days" },
                                { id: "4-6", value: "4-6", label: "4-6 Days" },
                                { id: "7-9", value: "7-9", label: "7-9 Days" },
                                { id: "10-12", value: "10-12", label: "10-12 Days" },
                                { id: "13+", value: "13+", label: "13+ Days" },
                            ].map((opt) => (
                                <div key={opt.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} id={`duration-${opt.id}`} />
                                    <Label htmlFor={`duration-${opt.id}`} className="!text-sm !font-semibold !text-slate-600 !cursor-pointer">
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-blue-600 rounded"></div>
                        <Label className="!text-sm !font-bold !text-slate-700 !uppercase !tracking-wider">Price</Label>
                    </div>
                    <RadioGroup value={priceFilter} onValueChange={(value) => setPriceFilter(value)}>
                        <div className="space-y-2">
                            {[
                                { id: "any", value: "all", label: "Any" },
                                { id: "0-10000", value: "0-10000", label: "₹ 0 - ₹ 10,000" },
                                { id: "10000-20000", value: "10000-20000", label: "₹ 10,000 - ₹ 20,000" },
                                { id: "20000-35000", value: "20000-35000", label: "₹ 20,000 - ₹ 35,000" },
                                { id: "35000-50000", value: "35000-50000", label: "₹ 35,000 - ₹ 50,000" },
                                { id: "50000+", value: "50000+", label: "₹ 50,000+" },
                            ].map((opt) => (
                                <div key={opt.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} id={`price-${opt.id}`} />
                                    <Label htmlFor={`price-${opt.id}`} className="!text-sm !font-semibold !text-slate-600 !cursor-pointer">
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="p-6 pt-4 flex-shrink-0 border-t border-slate-200 flex flex-col gap-3">
                <Button
                    variant="outline"
                    className="w-full !text-sm !text-slate-600 !font-bold !border-slate-200 hover:!bg-slate-50 transition-colors"
                    onClick={onClearFilters}
                >
                    Clear All Filters
                </Button>
                {onApply && (
                    <Button
                        className="w-full !text-sm !font-bold bg-blue-600 hover:bg-blue-700 text-white lg:hidden"
                        onClick={onApply}
                    >
                        Apply Filters
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SearchFilterSidebar;

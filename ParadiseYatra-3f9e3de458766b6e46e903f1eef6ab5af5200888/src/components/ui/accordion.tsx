"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  
  React.useEffect(() => {
    const element = triggerRef.current;
    if (element) {
      const checkState = () => {
        setIsOpen(element.getAttribute('data-state') === 'open');
      };
      
      const observer = new MutationObserver(checkState);
      observer.observe(element, { 
        attributes: true, 
        attributeFilter: ['data-state'] 
      });
      
      checkState();
      return () => observer.disconnect();
    }
  }, []);
  
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          triggerRef.current = node;
        }}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:bg-slate-50 [&[data-state=open]]:bg-slate-50",
          className
        )}
        {...props}
      >
        {children}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="ml-4"
        >
          <ChevronDown className="h-5 w-5 shrink-0 text-slate-600" />
        </motion.div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const accordionContentRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const element = accordionContentRef.current;
    if (element) {
      const checkState = () => {
        const state = element.getAttribute('data-state');
        setIsOpen(state === 'open');
      };
      
      const observer = new MutationObserver(checkState);
      observer.observe(element, { 
        attributes: true, 
        attributeFilter: ['data-state'] 
      });
      
      checkState();
      return () => observer.disconnect();
    }
  }, []);
  
  return (
    <AccordionPrimitive.Content
      ref={(node) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        accordionContentRef.current = node;
      }}
      className="overflow-hidden"
      {...props}
    >
      <motion.div
        ref={contentRef}
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        style={{ overflow: 'hidden' }}
        className={cn("pb-4 pt-0", className)}
      >
        {children}
      </motion.div>
    </AccordionPrimitive.Content>
  );
});

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

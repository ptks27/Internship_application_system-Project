import * as React from "react";
import PropTypes from "prop-types"; // Importing PropTypes

import { cn } from "@/lib/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm border-collapse border-2 border-purple-600", // Add purple border to table
        className
      )}
      {...props}
    />
  </div>
));

Table.displayName = "Table";
Table.propTypes = {
  className: PropTypes.string, // Define prop types
};

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b border-purple-600", className)} // Purple border for header rows
    {...props}
  />
));

TableHeader.displayName = "TableHeader";
TableHeader.propTypes = {
  className: PropTypes.string,
};

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));

TableBody.displayName = "TableBody";
TableBody.propTypes = {
  className: PropTypes.string,
};

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-slate-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-slate-800/50 border-purple-600", // Add purple border to footer
      className
    )}
    {...props}
  />
));

TableFooter.displayName = "TableFooter";
TableFooter.propTypes = {
  className: PropTypes.string,
};

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-purple-600 transition-colors hover:bg-purple-800/55 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800", // Purple border for rows and hover effect
      className
    )}
    {...props}
  />
));

TableRow.displayName = "TableRow";
TableRow.propTypes = {
  className: PropTypes.string,
};

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400 border-purple-600", // Purple border for table heads
      className
    )}
    {...props}
  />
));

TableHead.displayName = "TableHead";
TableHead.propTypes = {
  className: PropTypes.string,
};

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0 border-purple-600",
      className
    )} // Add purple border to table cells
    {...props}
  />
));

TableCell.displayName = "TableCell";
TableCell.propTypes = {
  className: PropTypes.string,
};

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";
TableCaption.propTypes = {
  className: PropTypes.string,
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

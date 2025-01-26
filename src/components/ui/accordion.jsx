import React from "react";
import "./accordion.css";
const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className={`accordion-item ${isOpen ? "open" : ""}`}>
      <button className="accordion-header" onClick={onClick}>
        {title}
        <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
      </button>
      <div className={`accordion-content ${isOpen ? "show" : ""}`}>
        {children}
      </div>
    </div>
  );
};
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = React.useState(null);
  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};
export default Accordion;

import React, { Component } from "react";
import PropTypes from "prop-types";

class CartAttributes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: {},
      isComplete: false,
    };
  }

  componentDidMount() {
    this.initializeAttributes();
  }
  initializeAttributes() {
    let initialAttributes = {};
    console.log("here n the cart attributes", this.props.item)
  
    if (this.props.item.fromDetailsPage) {
      this.props.item.selectedAttributes.forEach(attribute => {
        initialAttributes[attribute.key] = attribute.value;
      });
    } else {
      this.props.item.attributes.forEach(attribute => {
        initialAttributes[attribute.name] = attribute.attribute_items[0].value;
      });
    }
  
    this.setState({ selectedAttributes: initialAttributes });
  }
  
  handleAttributeClick = (attributeName, value) => {
    this.setState(
      (prevState) => ({
        selectedAttributes: {
          ...prevState.selectedAttributes,
          [attributeName]: value,
        },
      }),
      () => {
        const allSelected = this.checkIfAllAttributesSelected();
        if (allSelected) {
          this.props.onAttributeChange(this.state.selectedAttributes);
          this.setState({ isComplete: true });
        }
      }
    );
  };

  checkIfAllAttributesSelected = () => {
    const { attributes } = this.props.item;
    const { selectedAttributes } = this.state;

    return attributes.every((attr) =>
      selectedAttributes.hasOwnProperty(attr.name)
    );
  };

  isRelevantAttribute = (attributeName) => {
    const relevantAttributes = [
      "Size",
      "Color",
      "Touch ID in keyboard",
      "With USB 3 ports",
      "Capacity",
    ];
    return relevantAttributes.includes(attributeName);
  };

  render() {
    const { attributes } = this.props.item;
    const { selectedAttributes } = this.state;

    return (
      <div className="space-y-6">
        {attributes
          .filter((attr) => this.isRelevantAttribute(attr.name))
          .map((attr) => {
            const kebabCaseName = attr.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <div
                key={attr.id}
                className="attribute-group"
                data-testid={`cart-item-attribute-${kebabCaseName}`}
              >
                {/* Attribute Name */}
                <h3 className="mb-3 text-sm font-medium text-gray-800 sm:text-base">
                  {attr.name}
                </h3>
                {/* Attribute Options */}
                <div
                  className={`${
                    attr.name.toLowerCase() === "color"
                      ? "grid grid-cols-4 gap-9 sm:grid-cols-5 sm:gap-3"
                      : "flex flex-row  gap-1 "
                  }`}
                >
                  {attr.attribute_items.map((item) => {
                    const isSelected =
                      selectedAttributes[attr.name] === item.value;
                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          this.handleAttributeClick(attr.name, item.value)
                        }
                        className={`relative flex items-center justify-center rounded transition-all duration-100 
                     border-[1px] border-slate-300 
                  hover:bg-green-100 hover:scale-110 
                  focus:outline-1 focus:ring-1 focus:ring-green-500 active:bg-green-800 ${
                    isSelected
                      ? "border-green-500 shadow-sm scale-105 ring-2 ring-offset-2"
                      : "border-gray-300 bg-white shadow-sm"
                  }`}
                        style={
                          attr.name.toLowerCase() === "color"
                            ? {
                                backgroundColor: item.value,
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",

                                border: isSelected
                                  ? "3px solid #008000"
                                  : "1px solid #d1d5db",
                              }
                            : {
                                width: "60px",
                                height: "40px",
                                padding: "4px",
                                margin: "1px",
                                fontSize: "10px",
                              }
                        }
                        data-testid={`cart-item-attribute-${kebabCaseName}-${item.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")}${
                          isSelected ? "-selected" : ""
                        }`}
                      >
                        {attr.name.toLowerCase() !== "color" ? (
                          <span className="text-xs w-full text-center">
                            {item.displayValue}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}
CartAttributes.propTypes = {
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      attribute_items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          displayValue: PropTypes.string,
          value: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  onAttributeChange: PropTypes.func.isRequired,
};

export default CartAttributes;

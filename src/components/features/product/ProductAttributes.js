import React, { Component } from "react";
import PropTypes from "prop-types";

class ProductAttributes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: {},
      isComplete: false,
    };
  }

  componentDidMount() {
    const allSelected = this.checkIfAllAttributesSelected();
    if (allSelected) {
      // Notify parent of the selected attributes
      this.props.onAttributeChange(this.state.selectedAttributes);
      this.setState({ isComplete: true });
    }
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
          // If all attributes are selected, notify the parent
          this.props.onAttributeChange(this.state.selectedAttributes);
          this.setState({ isComplete: true });
        }
      }
    );
  };

  checkIfAllAttributesSelected = () => {
    const { attributes } = this.props;
    const { selectedAttributes } = this.state;

    if (attributes.length === 0) {
      return true;
    }

    // Check that each attribute has a corresponding selected value
    return attributes.every((attr) =>
      selectedAttributes.hasOwnProperty(attr.name)
    );
  };

  // Determine if the attribute is relevant to display
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
    const { attributes } = this.props;
    const { selectedAttributes } = this.state;

    return (
      <div>
        {attributes
          .filter((attr) => this.isRelevantAttribute(attr.name))
          .map((attr) => {
            const kebabCaseName = attr.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <div
                key={attr.id}
                className="my-4"
                data-testid={`product-attribute-${kebabCaseName}`}
              >
                <h3 className="mb-2 text-sm md:text-base">{attr.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {attr.attribute_items.map((item) => {
                    const isSelected =
                      selectedAttributes[attr.name] === item.value;
                    const itemDataTestId =
                      attr.name.toLowerCase() === "color"
                        ? `product-attribute-color-#${item.value
                            .toUpperCase()
                            .replace("#", "")}`
                        : `product-attribute-${kebabCaseName}-${item.value
                            .toUpperCase()
                            .replace(/\s+/g, "-")}`;

                    return (
                      <div data-testid={itemDataTestId}>
                        <button
                          key={item.id}
                          onClick={() =>
                            this.handleAttributeClick(attr.name, item.value)
                          }
                          className={`border px-2 md:px-3 py-1 text-sm md:text-base ${
                            isSelected ? "border-blue-500" : ""
                          }`}
                          style={
                            attr.name.toLowerCase() === "color"
                              ? {
                                  backgroundColor: item.value,
                                  width: "40px",
                                  height: "40px",
                                }
                              : {}
                          }
                        >
                          {attr.name.toLowerCase() !== "color"
                            ? item.displayValue
                            : ""}
                        </button>
                      </div>
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

ProductAttributes.propTypes = {
  attributes: PropTypes.array.isRequired,
  onAttributeChange: PropTypes.func.isRequired,
};

export default ProductAttributes;

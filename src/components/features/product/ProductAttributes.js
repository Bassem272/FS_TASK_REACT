import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProductAttributes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: {}, // Stores the selected attributes for the product
      isComplete: false, // Flags if all attributes have been selected
    };
  }

  // Check if all attributes are selected after mounting the component
  componentDidMount() {
    const allSelected = this.checkIfAllAttributesSelected();
    if (allSelected) {
      // Notify parent of the selected attributes
      this.props.onAttributeChange(this.state.selectedAttributes);
      this.setState({ isComplete: true }); // Set completion flag to true
    }
  }

  // Handle click events when an attribute value is selected
  handleAttributeClick = (attributeName, value) => {
    this.setState(
      (prevState) => ({
        selectedAttributes: {
          ...prevState.selectedAttributes,
          [attributeName]: value, // Add the selected value for the attribute
        },
      }),
      () => {
        const allSelected = this.checkIfAllAttributesSelected();
        if (allSelected) {
          // If all attributes are selected, notify the parent
          this.props.onAttributeChange(this.state.selectedAttributes);
          this.setState({ isComplete: true }); // Set the component as complete
        }
      }
    );
  };

  // Check if all the necessary attributes have been selected
  checkIfAllAttributesSelected = () => {
    const { attributes } = this.props;
    const { selectedAttributes } = this.state;

    // If there are no attributes to select, assume all are selected
    if (attributes.length === 0) {
      return true;
    }

    // Check that each attribute has a corresponding selected value
    return attributes.every((attr) => selectedAttributes.hasOwnProperty(attr.name));
  };

  // Determine if the attribute is relevant to display
  isRelevantAttribute = (attributeName) => {
    const relevantAttributes = [
      'Size',
      'Color',
      'Touch ID in keyboard',
      'With USB 3 ports',
      'Capacity',
    ];
    return relevantAttributes.includes(attributeName); // Only show relevant attributes
  };

  render() {
    const { attributes } = this.props;
    const { selectedAttributes } = this.state;

    return (
      <div>
        {attributes
          .filter((attr) => this.isRelevantAttribute(attr.name)) // Filter to show only relevant attributes
          .map((attr) => {
            const kebabCaseName = attr.name.toLowerCase().replace(/\s+/g, '-'); // Convert the attribute name to kebab-case
            return (
              <div
                key={attr.id}
                className="my-4"
                data-testid={`product-attribute-${kebabCaseName}`} // Test ID for easier testing
              >
                <h3 className="mb-2 text-sm md:text-base">{attr.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {attr.attribute_items.map((item) => {
                    const isSelected = selectedAttributes[attr.name] === item.value; // Check if the item is selected
                    // Ensure proper format of `data-testid` by making color value safe for the DOM
                    const itemDataTestId = attr.name.toLowerCase() === 'color'
                    ? `product-attribute-color-#${item.value.toUpperCase().replace('#', '')}`
                    : `product-attribute-${kebabCaseName}-${item.value.toUpperCase().replace(/\s+/g, '-')}`;
                  

                    return (
                      <div data-testid={itemDataTestId} >

                      <button
                        key={item.id}
                        onClick={() => this.handleAttributeClick(attr.name, item.value)} // Select item on click
                        className={`border px-2 md:px-3 py-1 text-sm md:text-base ${
                          isSelected ? 'border-blue-500' : '' // Highlight selected item with blue border
                        }`}
                        style={attr.name.toLowerCase() === 'color'
                          ? { backgroundColor: item.value, width: '40px', height: '40px' } // For color attribute, show it as a colored button
                          : {}
                        }
                        // data-testid={itemDataTestId} // Set the formatted `data-testid`
                        >
                        {attr.name.toLowerCase() !== 'color' ? item.displayValue : ''} {/* Display value, but skip it for color */}
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

// Type checking the props using PropTypes
ProductAttributes.propTypes = {
  attributes: PropTypes.array.isRequired, // Attributes should be an array
  onAttributeChange: PropTypes.func.isRequired, // onAttributeChange should be a function
};

export default ProductAttributes;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CartAttributes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: {},
      isComplete: false,
    };
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
    const { attributes } = this.props;
    const { selectedAttributes } = this.state;

    return attributes.every((attr) =>
      selectedAttributes.hasOwnProperty(attr.name)
    );
  };

  isRelevantAttribute = (attributeName) => {
    const relevantAttributes = [
      'Size',
      'Color',
      'Touch ID in keyboard',
      'With USB 3 ports',
      'Capacity',
    ];
    return relevantAttributes.includes(attributeName);
  };

render() {
  const { attributes } = this.props;
  const { selectedAttributes } = this.state;

  return (
    <div className="space-y-6"> {/* Consistent spacing between groups */}
      {attributes
        .filter((attr) => this.isRelevantAttribute(attr.name))
        .map((attr) => {
          const kebabCaseName = attr.name.toLowerCase().replace(/\s+/g, '-');
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
                className={` ${
                  attr.name.toLowerCase() === 'color'
                    ? ' grid grid-cols-3 gap-3 sm:grid-cols-5'
                    : 'flex flex-col-2 sm:grid-cols-4'
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
                      className={`flex items-center justify-center rounded transition-all duration-200 focus:outline-none ${
                        isSelected
                          ? 'border-blue-500 bg-blue-100 shadow-md'
                          : 'border-gray-300 bg-white shadow-sm'
                      }`}
                      style={
                        attr.name.toLowerCase() === 'color'
                          ? {
                              backgroundColor: item.value,
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              border: isSelected
                                ? '2px solid #3b82f6' // Blue for selected
                                : '1px solid #d1d5db', // Light gray for unselected
                            }
                          : {
                              padding: '8px 12px',
                              height: '40px',
                              minWidth: '50px',
                            }
                      }
                      data-testid={`cart-item-attribute-${kebabCaseName}-${item.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')}${
                        isSelected ? '-selected' : ''
                      }`}
                    >
                      {/* Display value for non-color attributes */}
                      {attr.name.toLowerCase() !== 'color' ? (
                        <span className="text-xs sm:text-sm">
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

import React from "react";

const StoreInfoWindow = ({ store }) => {
  const createStoreInfoContent = () => {
    return `
      <div style="padding: 12px; min-width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #333; line-height: 1.3;">
            ${store.name}
          </h3>
        </div>
        <div style="margin-bottom: 6px;">
          <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.4;">
            📍 ${store.address}
          </p>
        </div>
        ${
          store.tel
            ? `
          <div style="margin-bottom: 4px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              📞 ${store.tel}
            </p>
          </div>
        `
            : ""
        }
        ${
          store.category
            ? `
          <div>
            <span style="display: inline-block; padding: 2px 6px; background: #80c7bc; color: white; font-size: 10px; border-radius: 4px; font-weight: 500;">
              ${store.category}
            </span>
          </div>
        `
            : ""
        }
      </div>
    `;
  };

  return createStoreInfoContent();
};

export default StoreInfoWindow;

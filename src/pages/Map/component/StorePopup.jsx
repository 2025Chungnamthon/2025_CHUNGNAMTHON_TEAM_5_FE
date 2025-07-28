import React from "react";
import { FaMapMarkerAlt, FaPhone, FaTag } from "react-icons/fa";

const StoreInfoWindow = ({ store }) => {
  const createStoreInfoContent = () => {
    const { name, address, tel, category } = store;

    return `
      <div style="padding: 12px; min-width: 220px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #333; line-height: 1.3; word-break: break-word;">
            ${name}
          </h3>
        </div>
        <div style="margin-bottom: 6px;">
          <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.4; word-break: break-word;">
            <i class="fas fa-map-marker-alt" style="margin-right: 4px; color: #666;"></i>
            ${address}
          </p>
        </div>
        ${
          tel
            ? `
          <div style="margin-bottom: 4px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              <i class="fas fa-phone" style="margin-right: 4px; color: #666;"></i>
              ${tel}
            </p>
          </div>
        `
            : ""
        }
        ${
          category
            ? `
          <div style="margin-top: 4px;">
            <span style="display: inline-flex; align-items: center; padding: 2px 6px; background: #80c7bc; color: white; font-size: 10px; border-radius: 4px; font-weight: 500; max-width: 100%; word-break: break-word; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              <i class="fas fa-tag" style="margin-right: 3px; font-size: 8px; flex-shrink: 0;"></i>
              <span style="overflow: hidden; text-overflow: ellipsis;">${category}</span>
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

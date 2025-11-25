export const callHubApi = async (purchaseRequest) => {
  const hubApiUrl = process.env.HUB_API_URL || 'https://hub.foomid.id';
  const secretKey = process.env.HUB_API_SECRET;

  // Calculate total quantity from all items
  const qty_total = purchaseRequest.items.reduce((sum, item) => sum + item.quantity, 0);

  // Map items to the required format with product details
  const details = purchaseRequest.items.map(item => ({
    product_name: item.product?.name || '',
    sku_barcode: item.product?.sku || '',
    qty: item.quantity
  }));

  // Build payload according to API documentation
  const payload = {
    vendor: purchaseRequest.vendor,
    reference: purchaseRequest.reference,
    qty_total: qty_total,
    details: details
  };

  try {
    const response = await fetch(`${hubApiUrl}/api/request/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'secret-key': secretKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hub API returned status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Hub API response:', result);
    return result;
  } catch (error) {
    console.error('Hub API call failed:', error.message);
    throw new Error(`Failed to notify hub.foomid.id: ${error.message}`);
  }
};

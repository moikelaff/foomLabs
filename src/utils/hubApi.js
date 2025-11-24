export const callHubApi = async (purchaseRequest) => {
  const hubApiUrl = process.env.HUB_API_URL || 'https://hub.foomid.id';
  const apiKey = process.env.HUB_API_KEY;
  const apiSecret = process.env.HUB_API_SECRET;

  const payload = {
    reference: purchaseRequest.reference,
    warehouse_id: purchaseRequest.warehouse_id,
    vendor: purchaseRequest.vendor,
    items: purchaseRequest.items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    }))
  };

  try {
    const response = await fetch(hubApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-API-Secret': apiSecret
      },
      body: JSON.stringify(payload),
      timeout: parseInt(process.env.HUB_API_TIMEOUT || '5000')
    });

    if (!response.ok) {
      throw new Error(`Hub API returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Hub API call failed:', error.message);
    throw new Error(`Failed to notify hub.foomid.id: ${error.message}`);
  }
};

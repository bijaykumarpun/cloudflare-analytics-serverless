async function handleRequest(request) {
    const apiURL = "https://api.cloudflare.com/client/v4/graphql";
    const zoneId = "ZONE-ID"; // your zone ID
  
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
  
    function formatDate(d) {
      return d.toISOString().split('T')[0];  // Format date as YYYY-MM-DD
    }
  
    const start = formatDate(sevenDaysAgo);
    const end = formatDate(today);
  
    // Construct the GraphQL query with the payload
    const graphqlQuery = {
      query: `
            // GraphQL query here
      `,
      variables: {
        zoneTag: zoneId,
        since: start,
        until: end
      }
    };
  
    // Make the API call to Cloudflare GraphQL
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Authorization": "Bearer API-KEY", // Your API token here
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    // return response;
  
    // Check if the response was successful
    if (!response.ok) {
      return new Response(`Error fetching analytics: ${response.status}`, { status: 500 });
    }
  
    // Parse the response data
    const data = await response.json();
  
    try {
      // Extract the unique visitors data from the response
      const uniques = data.data.viewer.zones[0].totals[0].sum.uniques || 0;
  
      // Return the total unique visitors for the last 7 days
      return new Response(JSON.stringify({ uniques_last_7_days: uniques }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(`Error parsing analytics data: ${e.message}`, { status: 500 });
    }
  }
  
  // Event listener for incoming requests
  addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });
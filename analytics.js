export default {
    async fetch(request, env, ctx) {
        const apiURL = "https://api.cloudflare.com/client/v4/zones/ZONE_ID/analytics/dashboard";
        const response = await this.fetch(apiURL, {
            headers: {
                "Authorization": "Bearer API_TOKEN",
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        const uniqueVisitors = data.result.totals.uniques;

        return new Response(JSON.stringify({uniques: uniqueVisitors}), {
            headers: {"Content-Type": "application/json"},
        });
    
    }
}
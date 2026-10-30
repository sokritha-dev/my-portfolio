/**
 * Shared portfolio tools.
 *
 * - Website Ask chat: Gemini function calling → executePortfolioTool
 * - Future MCP server: wrap these same handlers (get_portfolio_stats, list_notes, …)
 */

export { portfolioToolDeclarations } from "@/lib/portfolio-tools/declarations";
export { executePortfolioTool } from "@/lib/portfolio-tools/handlers";

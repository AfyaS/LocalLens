// Azure API service for LocalLens
const AZURE_FUNCTION_BASE_URL = 'https://community-clarity-func-v2.azurewebsites.net/api';

export interface CivicAction {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date_time: string;
  organizer: string;
  contact_info: any;
  requirements: string[];
  accessibility_notes?: string;
  virtual_link?: string;
  tags: string[];
  status: string;
  priority: string;
}

export interface ApiIntegration {
  api_name: string;
  endpoint: string;
  data: any;
  last_updated: string;
  expires_at: string;
  status: string;
}

class AzureApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AZURE_FUNCTION_BASE_URL;
  }

  // Get all civic actions from the database
  async getCivicActions(): Promise<CivicAction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getCivicActions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.civicActions || [];
    } catch (error) {
      console.error('Error fetching civic actions:', error);
      return [];
    }
  }

  // Get MA Legislature hearings specifically
  async getMALegislatureHearings(): Promise<CivicAction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getMALegislatureHearings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.hearings || [];
    } catch (error) {
      console.error('Error fetching MA Legislature hearings:', error);
      return [];
    }
  }

  // Get API integration status
  async getApiIntegrationStatus(): Promise<ApiIntegration[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getApiIntegrations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.integrations || [];
    } catch (error) {
      console.error('Error fetching API integrations:', error);
      return [];
    }
  }

  // Trigger MA Legislature sync manually
  async triggerMALegislatureSync(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/malegislaturesync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error triggering MA Legislature sync:', error);
      throw error;
    }
  }
}

export const azureApi = new AzureApiService();

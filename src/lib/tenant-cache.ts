type TenantCacheType = {
    id: string;
    slug: string;
    name: string;
  };
  
  type CachedTenant = {
    data: TenantCacheType;
    expiresAt: number;
  };
  
  const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
  
  const tenantCache = new Map<string, CachedTenant>();
  
  export function getCachedTenant(slug: string) {
    const cached = tenantCache.get(slug);
  
    if (!cached) return null;
  
    if (Date.now() > cached.expiresAt) {
      tenantCache.delete(slug);
      return null;
    }
  
    return cached.data;
  }
  
  export function setCachedTenant(slug: string, tenant: TenantCacheType) {
    tenantCache.set(slug, {
      data: tenant,
      expiresAt: Date.now() + CACHE_TTL,
    });
  }

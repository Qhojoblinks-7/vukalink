# SaaS Multi-Tenancy: Application Logic & Documentation

## 3. Application Logic for Organization-Aware Record Creation

### Backend Example (Node.js/Express + Supabase JS)

```js
// When creating a new internship, application, etc.
const { data: userOrg } = await supabase
  .from('user_organizations')
  .select('organization_id')
  .eq('user_id', user.id)
  .single();

if (!userOrg) throw new Error('User not mapped to an organization');

const { data, error } = await supabase
  .from('internships')
  .insert([
    {
      title: 'Frontend Intern',
      organization_id: userOrg.organization_id,
      // ...other fields
    }
  ]);
```

### Onboarding Flow (Pseudocode)
- When a user signs up or is invited:
  1. Create the user in auth.users (handled by Supabase Auth).
  2. Assign the user to an organization:
     ```sql
     INSERT INTO public.user_organizations (user_id, organization_id)
     VALUES ('new_user_uuid', 'org_uuid')
     ON CONFLICT (user_id) DO NOTHING;
     ```
- Ensure all new records created by the user use their organization_id.

---

## 5. Documentation: RLS & Onboarding Process

### RLS Policy Summary
- All company-owned tables (companies, internships, applications, etc.) have RLS enabled.
- Policies enforce that users can only access rows where their organization_id matches (via user_organizations mapping).

### Onboarding Checklist
1. Create a new organization (if needed).
2. Create a new user (via Supabase Auth).
3. Map the user to the organization in user_organizations.
4. When the user creates data, always set organization_id to their mapped org.
5. Test: Log in as the user and confirm they only see their org’s data.

### Example SQL for Mapping
```sql
INSERT INTO public.user_organizations (user_id, organization_id)
VALUES ('user_uuid', 'org_uuid')
ON CONFLICT (user_id) DO NOTHING;
```

### Troubleshooting
- If a user cannot see or create data, check their mapping in user_organizations.
- If a user sees data from another org, review RLS policies for that table.

---

**Keep this file updated as you add new tables or features!**

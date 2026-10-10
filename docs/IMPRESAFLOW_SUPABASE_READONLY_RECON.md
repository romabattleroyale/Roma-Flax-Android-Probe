# ImpresaFlow — query di sola lettura per ricognizione Supabase

Queste query servono a raccogliere informazioni sul progetto già esistente. Sono di sola lettura: non creano, modificano o cancellano dati. Eseguirle soltanto nel progetto ImpresaFlow corretto. Non incollare qui password, token o chiavi API.

## 1. Confermare progetto e schema

```sql
select current_database() as database_name,
       current_schema() as current_schema,
       current_user as database_role,
       now() as checked_at;
```

Il nome del database spesso è `postgres`; non identifica da solo il progetto. Confrontare l'URL di progetto visibile nel dashboard Supabase.

## 2. Elencare le tabelle applicative pubbliche

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;
```

## 3. Verificare le colonne di tabelle base

```sql
select table_name, ordinal_position, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('profiles','customers','quotes','quote_items')
order by table_name, ordinal_position;
```

## 4. Verificare se le tabelle Incassi esistono già

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name like 'incassi_%'
order by table_name;
```

## 5. Verificare RLS e policy (senza leggere i dati dei clienti)

```sql
select n.nspname as schema_name,
       c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;
```

```sql
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## Importante

- Se una query dà errore, fermarsi e conservare il testo dell'errore; non improvvisare modifiche.
- Queste query non collaudano l'isolamento tra utenti e non autorizzano l'installazione dello schema.
- Non inviare risultati che contengono dati personali. Per la ricognizione bastano nomi di tabelle/colonne, flag RLS e messaggi d'errore depurati.
- Non eseguire ancora `impresaflow_initial_install_review.sql`: è un candidato per un progetto vuoto, non una migrazione verificata del progetto attuale.

import os

from alembic import context
from app.models import Base
from sqlalchemy import create_engine, pool


def get_url():
    url = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@db:5432/hackdb")
    return url


config = context.config
config.set_main_option("sqlalchemy.url", get_url())


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = get_url()
    context.configure(
        url=url,
        target_metadata=Base.metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = create_engine(get_url(), poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=Base.metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

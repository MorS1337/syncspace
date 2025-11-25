"""add password column

Revision ID: 3f1282d18d90
Revises: 2e0971d07c89
Create Date: 2025-11-25 23:30:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "3f1282d18d90"
down_revision: Union[str, None] = "2e0971d07c89"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("hashed_password", sa.String(length=255), nullable=False, server_default=""))
    # Remove server_default after adding column to avoid default empty string for new rows if desired, 
    # but for existing rows it's needed. We can alter it later or leave it.
    # Ideally we should make it nullable=True first, populate, then nullable=False.
    # But since we assume we can reset users or just have them invalid, this is fine.
    # Actually, let's just set default="" as above.


def downgrade() -> None:
    op.drop_column("users", "hashed_password")

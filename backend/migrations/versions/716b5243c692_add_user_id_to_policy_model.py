"""Add user_id to Policy model

Revision ID: 716b5243c692
Revises: c839076f7555
Create Date: 2024-11-07 20:41:57.992674

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '716b5243c692'
down_revision = 'c839076f7555'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###
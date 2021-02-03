import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointments1594758054222
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'provider',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            // Quando o usuario foi criado
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            // Ultima vez que o usuario sofreu alteracao
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments');
  }
}

/**
 * Linha do tempo:
 * Semana 1: Agendamentos
 * Semana 2: Usuários
 * Semana 3: Novo dev, atualizacao dos agendamentos
 * Semana 4: Compras
 *
 * Migrations serve para o banco de dados assim como o Git serve para o codigo
 */

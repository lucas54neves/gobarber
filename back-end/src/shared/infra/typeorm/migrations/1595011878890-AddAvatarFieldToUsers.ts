import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAvatarFieldToUsers1595011878890
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        // Tem que colocar como nulo porque pode ja existir dados na tabela
        // Com essa nova coluna, os dados antigos terao esse campo como nulo
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatar');
  }
}

import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class InstanceEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updated_at: Date;
}

export default InstanceEntity;

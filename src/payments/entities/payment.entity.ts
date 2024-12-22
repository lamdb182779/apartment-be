import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    orderId: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    transactionId: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
    amount: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    paymentMethod: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    bankCode: string;

    @Column({ type: 'timestamp', nullable: false })
    transactionDate: Date;

    @Column({ type: 'varchar', length: 20, nullable: false })
    status: string;

    @Column({ type: 'varchar', length: 5, nullable: false })
    language: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}